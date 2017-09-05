var Agency=require("../model/Agency");
var User=require("../model/User");
var Cooperation=require("../model/Cooperation");
var PageUtil=require("../util/PageUtil");

module.exports = {
    //前台列表
    'GET /agencys': async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Agency.findAndCountAll({
            where: {
                
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        for (var i = 0; i < result.length; i++) {
            var bean=result[i];
            if(bean.brand){
                bean.brand=bean.brand.split(",");
            }
        }
        ctx.render('./company/agencys.html',{
            result:result,
            nav:"agencys",
            page:PageUtil.getPage(page, result.count)
        });
    },
    //前台详情
    'GET /agency/:id': async (ctx, next) => {
        var id=ctx.params.id||1;
        var agency = await Agency.findById(id);
        if(agency&&agency.brand){
            agency.brand=agency.brand.split(",");
        }
        ctx.render('./company/agency.html',{bean:agency});
    },
    'GET /agency': async (ctx, next) => {
        var user=ctx.session.user;
        console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var agency = await Agency.findById(user.id);
        if(agency&&agency.brand){
            agency.brand=agency.brand.split(",");    
        }
        
        ctx.render('./company/add_agency.html',{bean:agency});
    },
    
    'POST /api/agency': async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            offical_website = ctx.request.body.offical_website||'',
            position = ctx.request.body.position||'',
            count_shop = ctx.request.body.count_shop||'',
            purchase_per_year = ctx.request.body.purchase_per_year||'',
            firsthand = ctx.request.body.firsthand||'',
            payment_days = ctx.request.body.payment_days||'',
            create_time = ctx.request.body.create_time||'',
            brands = ctx.request.body.brands||'',
            content = ctx.request.body.content||'';

        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        console.log("test user:",user.id);
        var agency = await Agency.create({
            id:user.id,
            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            phone:phone,
            custom_service:custom_service,
            email:email,
            position:position,
            count_shop:count_shop,
            payment_days:payment_days,
            purchase_per_year:purchase_per_year,
            firsthand:firsthand,
            offical_website:offical_website,
            brand:brands,
            create_time:create_time
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":agency.id};
    },
    'PUT /api/agency': async (ctx, next) => {
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
            offical_website = ctx.request.body.offical_website||'',
            position = ctx.request.body.position||'',
            count_shop = ctx.request.body.count_shop||'',
            purchase_per_year = ctx.request.body.purchase_per_year||'',
            firsthand = ctx.request.body.firsthand||'',
            payment_days = ctx.request.body.payment_days||'',
            create_time = ctx.request.body.create_time||'',
            brands = ctx.request.body.brands||'',
            content = ctx.request.body.content||'';

       
         var agency = await Agency.findById(id);
        agency.name=name;
        agency.ename=ename;
        agency.address=address;
        agency.legal_person=legal_person;
        agency.phone=phone;
        agency.custom_service=custom_service;
        agency.email=email;
        agency.offical_website=offical_website;
        agency.position=position;
        agency.count_shop=count_shop;
        agency.purchase_per_year=purchase_per_year;
        agency.firsthand=firsthand;
        agency.payment_days=payment_days;
        agency.content=content;
        agency.brand=brands;
        agency.create_time=create_time;

        await agency.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":agency.id};
    }
    
};
