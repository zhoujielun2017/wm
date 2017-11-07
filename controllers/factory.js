var Factory=require("../model/Factory"),
    User=require("../model/User"),
    Product=require("../model/Product"),
    City=require("../model/City"),
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
        if(factory&&factory.brand){
            factory.brand=factory.brand.split(",");
        }
        if(factory&&factory.major){
            factory.major=factory.major.split(",");
        }

        var list = await Cooperation.findAll({
            where: {
                user_id: factory.user_id
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
                
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        ctx.render('./company/factory.html',{
            bean:factory,
            factorys:factorys,
            customers:customers,
            pros:pros,
            page:PageUtil.getPage(page, pros.count)
        });
    };

    var manage_factorys=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Factory.findAndCountAll({
            where: {
                
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0; i < result.count; i++) {
            var bean=result.rows[i];

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
            var user = await User.findById(bean.user_id);
            bean.head=user&&user.head_url;
        }
       
        ctx.render('./manage/factory/list.html',{
            result:result,
            page:PageUtil.getPage(page, result.count)
        });
    };
    var manage_factory=async (ctx, next) => {
        var id=ctx.request.query.id;
        var factory = await Factory.findById(id);
        ctx.render('./manage/factory/add.html',{bean:factory});
    };
    var factory=async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var factory = await Factory.findById(user.id);
        
        ctx.render('./company/add_factory.html',{bean:factory});
    };
    var api_factory=async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        //console.log("test user:",user.id);
        var factory = await Factory.create({
            
            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            legal_person:legal_person,
            phone:phone,
            custom_service:custom_service,
            email:email,
            area:area,
            content: content
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
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
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

       
         var factory = await Factory.findById(id);
        factory.name=name;
        factory.ename=ename;
        factory.address=address;
        factory.legal_person=legal_person;
        factory.phone=phone;
        factory.custom_service=custom_service;
        factory.email=email;
        factory.area=area;
        factory.content=content;
        await factory.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":factory.id};
    };

    var api_factorydetail=async (ctx, next) => {
         var user=ctx.session.user;
         var id = ctx.request.body.id||'',
            types = ctx.request.body.types,
            names = ctx.request.body.names,
            acreage = ctx.request.body.acreage||'',
            type_per_month = ctx.request.body.type_per_month||'',
            count_person = ctx.request.body.count_person||'',
            count_qc = ctx.request.body.count_qc||'',
            able_per_month = ctx.request.body.able_per_month||'',
            majors = ctx.request.body.majors||'';

        var typearr=types.split(",");
        var namearr=names.split(",");

        await Cooperation.destroy({
          where: {
            user_id:user.id
          }
        });

        for (var i = 0; i < typearr.length; i++) {
            var type=typearr[i];
            var name=namearr[i];
           
            var cooperation = await Cooperation.create({
                user_id:user.id,
                name: name,
                type:type
            });
        }
        
        var factory = await Factory.findById(id);
        factory.acreage=acreage;
        
        factory.type_per_month=type_per_month;
        factory.count_person=count_person;
        factory.count_qc=count_qc;
        factory.able_per_month=able_per_month;
        factory.major=majors;
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
    };
module.exports = {
    //前台列表
    'GET /factorys': factorys,
    //前台详情
    'GET /factory/:id': factory_id,
    //前台列表
    'GET /manage/factorys':manage_factorys ,
     //后台添加factory
    'GET /manage/factory':manage_factory,
    //前台编辑页
    'GET /factory':factory ,
    
    'POST /api/factory': api_factory,
    'PUT /api/factory': api_factory_update,
    'DELETE /api/factory/:id': api_factory_delete,
    'PUT /api/factorydetail': api_factorydetail
};
