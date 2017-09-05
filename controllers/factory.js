var Factory=require("../model/Factory");
var User=require("../model/User");
var Product=require("../model/Product");
var Cooperation=require("../model/Cooperation");
var PageUtil=require("../util/PageUtil");

module.exports = {
    //前台列表
    'GET /factorys': async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Factory.findAndCountAll({
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
        ctx.render('./company/factorys.html',{
            result:result,
            nav:"factorys",
            page:PageUtil.getPage(page, result.count)
        });
    },
    //前台详情
    'GET /factory/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var page=ctx.request.query.page||1;
        var factory = await Factory.findById(id);
        if(factory&&factory.brand){
            factory.brand=factory.brand.split(",");
        }
        if(factory&&factory.major){
            factory.major=factory.major.split(",");
        }


        var pros = await Product.findAndCountAll({
            where: {
                
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
        ctx.render('./company/factory.html',{
            bean:factory,
            pros:pros,
            page:PageUtil.getPage(page, pros.count)
        });
    },
    'GET /factory': async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var factory = await Factory.findById(user.id);
        
        ctx.render('./company/add_factory.html',{bean:factory});
    },
    
    'POST /api/factory': async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            content = ctx.request.body.content||'';
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        console.log("test user:",user.id);
        var factory = await Factory.create({
            id:user.id,
            user_id:user.id,
            name: name,
            ename:ename,
            address:address,
            legal_person:legal_person,
            phone:phone,
            custom_service:custom_service,
            email:email,
            content: content
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":factory.id};
    },
    'PUT /api/factory': async (ctx, next) => {
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
            content = ctx.request.body.content||'';

       
         var factory = await Factory.findById(id);
        factory.name=name;
        factory.ename=ename;
        factory.address=address;
        factory.legal_person=legal_person;
        factory.phone=phone;
        factory.custom_service=custom_service;
        factory.email=email;
        factory.content=content;
        await factory.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":factory.id};
    },
    'PUT /api/factorydetail': async (ctx, next) => {
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
    }
};
