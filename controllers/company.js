var Agency=require("../model/Agency");
var User=require("../model/User");
var Cooperation=require("../model/Cooperation");

module.exports = {
    'GET /agency': async (ctx, next) => {
        var user=ctx.session.user;
        //console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var agency = await Agency.findById(user.id);
        
        ctx.render('./company/agency.html',{bean:agency});
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
            content = ctx.request.body.content||'';
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        //console.log("test user:",user.id);
        var agency = await Agency.create({
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
            content = ctx.request.body.content||'';

       
         var agency = await Agency.findById(id);
        agency.name=name;
        agency.ename=ename;
        agency.address=address;
        agency.legal_person=legal_person;
        agency.phone=phone;
        agency.custom_service=custom_service;
        agency.email=email;
        agency.content=content;
        await agency.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":agency.id};
    },
    'PUT /api/agencydetail': async (ctx, next) => {
         var user=ctx.session.user;
         var id = ctx.request.body.id||'',
            types = ctx.request.body.types,
            names = ctx.request.body.names,
            acreage = ctx.request.body.acreage||'',
            type_per_month = ctx.request.body.type_per_month||'',
            count_person = ctx.request.body.count_person||'',
            count_qc = ctx.request.body.count_qc||'',
            able_per_month = ctx.request.body.able_per_month||'',
            major = ctx.request.body.major||'';

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
        
        var agency = await Agency.findById(id);
        agency.acreage=acreage;
        
        agency.type_per_month=type_per_month;
        agency.count_person=count_person;
        agency.count_qc=count_qc;
        agency.able_per_month=able_per_month;
        agency.major=major;
        await agency.save();
       
        ctx.body = {"code":"success","id":agency.id};
    }
};
