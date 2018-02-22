var Factory=require("../model/Factory"),
    FactoryImg=require("../model/FactoryImg"),
    User=require("../model/User"),
    Product=require("../model/Product"),
    City=require("../model/City"),
    UserService=require("../service/UserService"),
    Cooperation=require("../model/Cooperation"),
    PageUtil=require("../util/PageUtil");
   
var factorys = async (ctx, next) => {
    var page=ctx.request.query.page||1;
    var result = await Factory.findAndCountAll({
        where: {
            
        },
        'limit': PageUtil.pageSize,
        'offset': PageUtil.pageSize*(page-1)
    });
    for (var i = 0; i < result.count; i++) {
        var bean=result.rows[i];
        if(!bean){
            break;
        }
        if(bean.major){
            bean.major=bean.major.split(",");
            //console.log("bean.major",bean.major);
        }
        var cops = await Cooperation.findAll({
            where:{
                factory_id:bean.id
            },
            order: [['create_time', 'DESC']]
        });
        bean.cops=cops;

        if(bean.area){
            bean.area=bean.area.split("_");
        }else{
            bean.area=[];
        }
        // console.log("bean.area",bean.area);
        var areas = await City.findAll({
            where:{
                id:{
                "$in":bean.area
                }
            }
            
        });
        bean.areas=areas;
        var user = await User.findById(bean.user_id);
        bean.head=user&&user.head_url;
    }
    
    ctx.render('./company/factorys.html',{
        result:result,
        nav:"factorys",
        cops:cops,
        page:PageUtil.getPage(page, result.count)
    });
};

var factory_id=async (ctx, next) => {
        var id=ctx.params.id;
        var page=ctx.request.query.page||1;
        var factory = await Factory.findById(id);
        var imgs = await FactoryImg.findAll({
            where:{
                factory_id:id
            }
        })
        
        if(factory&&factory.brand){
            factory.brand=factory.brand.split(",");
        }
        if(factory&&factory.major){
            factory.major=factory.major.split(",");
        }

        var list = await Cooperation.findAll({
            where: {
                factory_id: factory.id
            }
        });
        var customers=[];
        var factorys=[];
        for (var i = 0; i < list.length; i++) {
            if(list[i].type=='factory'){
                factorys.push(list[i]);
            }
            if(list[i].type!='factory'){
                customers.push(list[i]);
            }
        }

         var user = await User.findById(factory.user_id);
        factory.head=user&&user.head_url;
        
        var pros = await Product.findAndCountAll({
            where: {
                user_id:factory.user_id
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for(var i=0,len=pros.rows.length;i<len;i++){
            var bean=pros.rows[i];
          
            bean.price=(bean.price/100).toFixed(2);
           
        }
        

        ctx.render('./company/factory.html',{
            bean:factory,
            factorys:factorys,
            customers:customers,
            pros:pros,
            imgs:imgs,
            page:PageUtil.getPage(page, pros.count)
        });
    },
     manage_factorys=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Factory.findAndCountAll({
            where: {
                
            },
            order: [['create_time', 'DESC']],
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0; i < result.count; i++) {
            var bean=result.rows[i];
            var user = await User.findById(bean.user_id);
            bean.email=user&&user.email;
             bean.head=user&&user.head_url;
            if(bean.major){
                bean.major=bean.major.split(",");
                //console.log("bean.major",bean.major);
            }
            var cops = await Cooperation.findAll({
                where:{
                    user_id:bean.user_id
                },
                order: [['create_time', 'DESC']]
            });
            bean.cops=cops;
            
            if(bean.area){
                bean.area=bean.area.split("_");
            }else{
                bean.area=[];
            }
            // console.log("bean.area",bean.area);
            var areas = await City.findAll({
                where:{
                    id:{
                    "$in":bean.area
                    }
                }
                
            });
            bean.areas=areas;
           
           
        }
       
        ctx.render('./manage/factory/list.html',{
            result:result,
            page:PageUtil.getPage(page, result.count)
        });
    },
     manage_factory=async (ctx, next) => {
        var id=ctx.request.query.id;
        var factory = await Factory.findById(id);
        ctx.render('./manage/factory/add.html',{bean:factory});
    },
     factory=async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var factorys = await Factory.findAll({
             where:{
                user_id:user.id
            }
        });
        var factory;
        if(factorys){
            factory=factorys[0];
        }
        ctx.render('./company/add_factory.html',{bean:factory});
    },
    manage_factory_add=async (ctx, next) => {

        
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';
        
        var user = await UserService.createUser(name,"factory");
        
        var factory = await Factory.create({
            
            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            en_city:en_city,
            en_nation:en_nation,
            en_address:en_address,
            legal_person:legal_person,
            phone:phone,
            custom_service:custom_service,
            email:email,
            area:area,
            content: content
        });
      
        ctx.body = {"code":"success","id":factory.id};
    },
    api_factory=async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            city = ctx.request.body.city||'',
            nation = ctx.request.body.nation||'',
            en_city = ctx.request.body.en_city||'',
            en_nation = ctx.request.body.en_nation||'',
            en_address = ctx.request.body.en_address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            cellphone= ctx.request.body.cellphone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            sale_manager_phone=ctx.request.body.sale_manager_phone||'',
            sale_manager_email=ctx.request.body.sale_manager_email||'',
            sale_manager=ctx.request.body.sale_manager||'',
            build_time = ctx.request.body.build_time||Date.now(),
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        
        var factory = await Factory.create({
            
            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            city:city,
            nation:nation,
            en_city:en_city,
            en_nation:en_nation,
            en_address:en_address,
            legal_person:legal_person,
            phone:phone,
            cellphone:cellphone,
            custom_service:custom_service,
            email:email,
            sale_manager:sale_manager,
            sale_manager_email:sale_manager_email,
            sale_manager_phone:sale_manager_phone,
            build_time:build_time,
            area:area,
            search:name,
            content: content
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=custom_service;
        dbUser.save();
        ctx.body = {"code":"success","id":factory.id};
    };
    var api_factory_update=async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        var id = ctx.request.body.id||'',
            name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            city = ctx.request.body.city||'',
            nation = ctx.request.body.nation||'',
            address = ctx.request.body.address||'',
            en_city = ctx.request.body.en_city||'',
            en_nation = ctx.request.body.en_nation||'',
            en_address = ctx.request.body.en_address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            cellphone= ctx.request.body.cellphone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            sale_manager=ctx.request.body.sale_manager||'',
            sale_manager_email=ctx.request.body.sale_manager_email||'',
            sale_manager_phone=ctx.request.body.sale_manager_phone||'',
            area = ctx.request.body.area||'',
            build_time = ctx.request.body.build_time||Date.now(),
            content = ctx.request.body.content||'';
       
        var factory = await Factory.findById(id);
         if(!factory.user_id){
            var user= await UserService.createUser(name,"factory");
            factory.user_id=user.id;
        }
        var cops = await Cooperation.findAll({
            where:{
                factory_id:id
            }
        });
        var search=[];
        if(factory.major){
            search.push(factory.major?factory.major.replace(","," "):"");
            var majors = factory.major.split(",");
            for (var i = 0,len1=majors.length; i < len1; i++) {
                var key=majors[i];
                search.push(ctx.i18n.__(key));
            }
        }

        var len=cops?cops.length:0;
         for (var i = 0; i < len; i++) {
            search.push(cops[i].name.replace(","," "));
         }
        
        factory.search=search.join(",");
        factory.name=name;
        factory.ename=ename;
        factory.address=address;
        factory.city=city;
        factory.nation=nation;
        factory.en_city=en_city,
        factory.en_nation=en_nation,
        factory.en_address=en_address,
        factory.cellphone=cellphone,
        factory.legal_person=legal_person;
        factory.phone=phone;
        factory.custom_service=custom_service;
        factory.email=email;
        factory.sale_manager=sale_manager;
        factory.sale_manager_email=sale_manager_email;
        factory.sale_manager_phone=sale_manager_phone;
        factory.area=area;
        factory.content=content;
        factory.build_time=build_time;
        await factory.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=custom_service;
        dbUser.save();
        ctx.body = {"code":"success","id":factory.id};
    },
    //供应商详情
    api_factorydetail=async (ctx, next) => {
         var user=ctx.session.user;
         var id = ctx.request.body.id||'',
            types = ctx.request.body.types,
            names = ctx.request.body.names,
            co_times = ctx.request.body.co_times,
            acreage = ctx.request.body.acreage||'',
            type_per_month = ctx.request.body.type_per_month||'',
            count_person = ctx.request.body.count_person||'',
            count_qc = ctx.request.body.count_qc||'',
            count_dev=ctx.request.body.count_dev||'',
            count_trade=ctx.request.body.count_trade||'',
            able_per_month = ctx.request.body.able_per_month||'',
            sale_per_year= ctx.request.body.sale_per_year||'',
            products = ctx.request.body.products||'',            
            majors = ctx.request.body.majors||'';

        var typearr=types.split(",");
        var namearr=names.split(",");
        var timearr=co_times.split(",");
        //先删除合作信息
        await Cooperation.destroy({
          where: {
            factory_id:id
          }
        });

        for (var i = 0; i < typearr.length; i++) {
            var type=typearr[i];
            var name=namearr[i];
            var time=timearr[i]||null;//如果为0
            var cooperation = await Cooperation.create({
               
                factory_id:id,
                name: name,
                type:type,
                co_time:time,
                version:i
            });
        }
        
        
        var factory = await Factory.findById(id);
        //处理搜索字段
        var search=[];
        search.push(factory.name.replace(","," "));
        search.push(majors);
        var majorArr = majors.split(",");
        for (var i = 0,len1=majorArr.length; i < len1; i++) {
            var m=majorArr[i];
            search.push(i18n_majors[m]);
        }
        search.push(namearr);

        factory.search=search.join(",");
        factory.acreage=acreage;
        factory.type_per_month=type_per_month;
        factory.count_person=count_person;
        factory.count_qc=count_qc;
        factory.count_trade=count_trade;
        factory.count_dev=count_dev;
        factory.able_per_month=able_per_month;
        factory.sale_per_year=sale_per_year;
        factory.major=majors;
        factory.product=products;
        await factory.save();
       
        ctx.body = {"code":"success","id":factory.id};
    };
    var api_factory_delete=async (ctx, next) => {
         var id=ctx.params.id;

        await Factory.destroy({
          where: {
            id:id
          }
        });
       
        ctx.body = {"code":"success"};
    },
    factory_search_init=async (ctx, next) => {

        var factorys = await Factory.findAll({});

        for (var f = 0,lenf=factorys.length; f < lenf; f++) {
            
            var factory = factorys[f];

            var search=[];
            if(factory.major){
                //英文
                search.push(factory.major?factory.major.replace(","," "):"");
                //中文
                var majors = factory.major.split(",");
                for (var i = 0,len1=majors.length; i < len1; i++) {
                    var key=majors[i];
                    search.push(ctx.i18n.__(key));
                }
            }
            
            //合作伙伴
            var cops = await Cooperation.findAll({
                where:{
                    factory_id:factory.id,
                }
             });
             
             var len=cops?cops.length:0;
             for (var i = 0; i < len; i++) {
                 search.push(cops[i].name.replace(","," "));
             }
            
            factory.search=search.join(",");
            factory.save();
        }
       ctx.body = {"code":"success"};
   };
module.exports = {
    //前台列表
    'GET /factorys': factorys,
    //前台详情
    'GET /factory/:id': factory_id,
    //前台列表
    'GET /manage/factorys':manage_factorys ,
     //后台添加factory页面
    'GET /manage/factory':manage_factory,
     //后台添加factory接口
    'POST /manage/factory':manage_factory_add,
    //前台编辑页
    'GET /factory':factory ,
    //重置搜索字段
    'GET /factory/search/init':factory_search_init ,
    //添加供应商
    'POST /api/factory': api_factory,
    //更新供应商
    'PUT /api/factory': api_factory_update,
    'DELETE /api/factory/:id': api_factory_delete,
    //更新供应商详情
    'PUT /api/factorydetail': api_factorydetail,
    
};
