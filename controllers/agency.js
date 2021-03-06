var Agency=require("../model/Agency"),
    User=require("../model/User"),
    crypto = require('crypto'),
    Setting=require("../model/Setting"),
    City=require("../model/City"),
    UserService=require("../service/UserService"),
    Cooperation=require("../model/Cooperation"),
    PageUtil=require("../util/PageUtil");

var agencys=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Agency.findAndCountAll({
            where: {
                
            },
            order: [['sort', 'DESC']],
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0,len=result.count; i < len; i++) {
            var bean=result.rows[i];
            if(!bean){
                break;
            }
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
        ctx.render('./company/agencys.html',{
            result:result,
            nav:"agencys",
            page:PageUtil.getPage(page, result.count)
        });
    }
    var agency_id=async (ctx, next) => {
        var id=ctx.params.id||1;
        var bean = await Agency.findById(id);
        // if(bean&&bean.brand){
        //     bean.brand=bean.brand.split(",");
        // }
        if(!bean){
            return ctx.render('./404.html',{});
        }
        var user = await User.findById(bean.user_id);
        bean.head=user&&user.head_url;
        ctx.render('./company/agency.html',{bean:bean});
    };
    var manage_agencys=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Agency.findAndCountAll({
            where: {
                
            },
            order: [['sort', 'DESC']],
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0,len=result.count; i < len; i++) {
            var bean=result.rows[i];
            if(!bean){
                break;
            }
             var user = await User.findById(bean.user_id);
            bean.email=user&&user.email;
            bean.head=user&&user.head_url;
            if(bean.brand){
                bean.brand=bean.brand.split(",");
            }
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
        ctx.render('./manage/agency/list.html',{
            result:result,
            page:PageUtil.getPage(page, result.count)
        });
    },
    manage_agency=async (ctx, next) => {
        var id=ctx.request.query.id;
        var bean = await Agency.findById(id);
        if(bean&&bean.brand){
            bean.brand=bean.brand.split(",");    
        }
        ctx.render('./manage/agency/add.html',{bean:bean});

    },
    agency=async (ctx, next) => {
        var user=ctx.session.user;
        //console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var agencys = await Agency.findAll({
            where:{
                user_id:user.id
            }
        });
        var agency;
        if(agencys){
            agency=agencys[0];
        }
        if(agency&&agency.brand){
            agency.brand=agency.brand.split(",");    
        }
        
        ctx.render('./company/add_agency.html',{bean:agency});
    },
    //后台添加接口
    manage_agency_add=async (ctx, next) => {

        
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
             twitter = ctx.request.body.twitter||'',
              facebook = ctx.request.body.facebook||'',
            offical_website = ctx.request.body.offical_website||'',
            position = ctx.request.body.position||'',
            count_shop = ctx.request.body.count_shop||'',
            purchase_per_year = ctx.request.body.purchase_per_year||'',
            firsthand = ctx.request.body.firsthand||'',
            payment_days = ctx.request.body.payment_days||'',
            create_time = ctx.request.body.create_time||'',
            brands = ctx.request.body.brands||'',
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

        var user = await UserService.createUser(custom_service,"agency");
        
        var agency = await Agency.create({
            
            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            phone:phone,
            custom_service:custom_service,
            email:email,
            twitter:twitter,
            facebook:facebook,
            position:position,
            count_shop:count_shop,
            payment_days:payment_days,
            purchase_per_year:purchase_per_year,
            firsthand:firsthand,
            offical_website:offical_website,
            brand:brands,
            area:area,
            create_time:create_time
        });
      
        ctx.body = {"code":"success","id":agency.id};
    },
     api_agency=async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            company_phone = ctx.request.body.company_phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
             twitter = ctx.request.body.twitter||'',
              facebook = ctx.request.body.facebook||'',
            offical_website = ctx.request.body.offical_website||'',
            china = ctx.request.body.china||'',
            china_office = ctx.request.body.china_office||'',
            position = ctx.request.body.position||'',
            count_shop = ctx.request.body.count_shop||'',
            purchase_per_year = ctx.request.body.purchase_per_year||'',
            firsthand = ctx.request.body.firsthand||'',
            payment_days = ctx.request.body.payment_days||'',
            create_time = ctx.request.body.create_time||'',
            brands = ctx.request.body.brands||'',
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        
        var agency = await Agency.create({
            
            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            phone:phone,
            company_phone:company_phone,
            custom_service:custom_service,
            email:email,
            twitter:twitter,
            facebook:facebook,
            position:position,
            count_shop:count_shop,
            payment_days:payment_days,
            purchase_per_year:purchase_per_year,
            firsthand:firsthand,
            offical_website:offical_website,
            china:china,
            china_office:china_office,
            brand:brands,
            area:area,
            sort:0,
            create_time:create_time
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=custom_service;
        dbUser.save();
        ctx.body = {"code":"success","id":agency.id};
    },
     api_agency_update=async (ctx, next) => {
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
            company_phone = ctx.request.body.company_phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            twitter = ctx.request.body.twitter||'',
            facebook = ctx.request.body.facebook||'',
            offical_website = ctx.request.body.offical_website||'',
            china = ctx.request.body.china||'',
            china_office = ctx.request.body.china_office||'',
            
            position = ctx.request.body.position||'',
            count_shop = ctx.request.body.count_shop||'',
            purchase_per_year = ctx.request.body.purchase_per_year||'',
            firsthand = ctx.request.body.firsthand||'',
            payment_days = ctx.request.body.payment_days||'',
            build_time = ctx.request.body.build_time||Date.now(),
            brands = ctx.request.body.brands||'',
            area = ctx.request.body.area||'',
            content = ctx.request.body.content||'';

        var agency = await Agency.findById(id);
        if(!agency.user_id){
            var user= await UserService.createUser(name,"agency");
            agency.user_id=user.id;
        }

        agency.name=name;
        agency.ename=ename;
        agency.address=address;
        agency.legal_person=legal_person;
        agency.phone=phone;
        agency.company_phone=company_phone;
        agency.custom_service=custom_service;
        agency.email=email;
         agency.twitter=twitter;
          agency.facebook=facebook;
        agency.offical_website=offical_website;
        agency.china=china;
        agency.china_office=china_office;
        agency.position=position;
        agency.count_shop=count_shop;
        agency.purchase_per_year=purchase_per_year;
        agency.firsthand=firsthand;
        agency.payment_days=payment_days;
        agency.content=content;
        agency.brand=brands;
        agency.area=area;
        agency.build_time=build_time;

        await agency.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=custom_service;
        dbUser.save();
        ctx.body = {"code":"success","id":agency.id};
    }, api_agency_delete=async (ctx, next) => {
         var id=ctx.params.id;

        await Agency.destroy({
          where: {
            id:id
          }
        });
       
        ctx.body = {"code":"success"};
    };
    var api_agency_update_sort=async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        var id = ctx.request.body.id||'',
            sort = ctx.request.body.sort||1;
        var bean = await Agency.findById(id);
        bean.sort=sort;
        await bean.save();
        ctx.body = {"code":"success"};
    };
    
module.exports = {
    //前台列表
    'GET /agencys': agencys,
    //前台详情
    'GET /agency/:id': agency_id,
    //前台编辑页面
    'GET /agency': agency,
    //后台列表
    'GET /manage/agencys': manage_agencys,
    //后台添加编辑agency
    'GET /manage/agency': manage_agency,
    //后台添加接口
    'POST /manage/agency': manage_agency_add,
    //添加接口
    'POST /api/agency': api_agency,
    //更新接口
    'PUT /api/agency': api_agency_update,
    'PUT /api/agency/sort': api_agency_update_sort,
    //删除接口
    'DELETE /api/agency/:id': api_agency_delete
    
};
