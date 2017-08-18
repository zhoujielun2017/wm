var Company=require("../model/Company");
var User=require("../model/User");

module.exports = {
    'GET /company': async (ctx, next) => {
        var user=ctx.session.user;
        console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var company = await Company.findById(user.id);
        
        ctx.render('./company/company.html',{bean:company});
    },
    
    'POST /api/company': async (ctx, next) => {

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
        var company = await Company.create({
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
        ctx.body = {"code":"success","id":company.id};
    },
    'PUT /api/company': async (ctx, next) => {
         var user=ctx.session.user;
         var id = ctx.request.body.id||'',
            name = ctx.request.body.name||'',
            ename = ctx.request.body.ename||'',
            address = ctx.request.body.address||'',
            legal_person = ctx.request.body.legal_person||'',
            phone = ctx.request.body.phone||'',
            custom_service = ctx.request.body.custom_service||'',
            email = ctx.request.body.email||'',
            content = ctx.request.body.content||'';

       
         var company = await Company.findById(id);
        company.name=name;
        company.ename=ename;
        company.address=address;
        company.legal_person=legal_person;
        company.phone=phone;
        company.custom_service=custom_service;
        company.email=email;
        company.content=content;
        await company.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":company.id};
    },
    'PUT /api/companydetail': async (ctx, next) => {
         var user=ctx.session.user;
         var id = ctx.request.body.id||'',
            acreage = ctx.request.body.acreage||'',
            type_per_month = ctx.request.body.type_per_month||'',
            count_person = ctx.request.body.count_person||'',
            count_qc = ctx.request.body.count_qc||'',
            able_per_month = ctx.request.body.able_per_month||'',
            major = ctx.request.body.major||'';

       
        var company = await Company.findById(id);
        company.acreage=acreage;
        
        company.type_per_month=type_per_month;
        company.count_person=count_person;
        company.count_qc=count_qc;
        company.able_per_month=able_per_month;
        company.major=major;
        await company.save();
       
        ctx.body = {"code":"success","id":company.id};
    }
    // 'GET /api/company/:id': async (ctx, next) => {
         
    //     var id = ctx.params.id;
    //     var data = await Company.findById(id);
    //     ctx.response.type = 'application/json';
    //     ctx.response.body = JSON.stringify(data);
    // }
};