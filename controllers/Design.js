var Design=require("../model/Design");
var User=require("../model/User");
var Cooperation=require("../model/Cooperation");

module.exports = {
    'GET /design': async (ctx, next) => {
        var user=ctx.session.user;
        console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var design = await Design.findById(user.id);
        if(design&&design.work_experience)
        design.work_experience=design.work_experience.split(",");
        ctx.render('./company/design.html',{bean:design});
    },
    
    'POST /api/design': async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            gender = ctx.request.body.gender||'',
            age = ctx.request.body.age||'',
            status = ctx.request.body.status||'',
            major = ctx.request.body.major||'',
            exps = ctx.request.body.exps,
            content = ctx.request.body.content||'';

        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        console.log("test user:",user.id);
        var design = await Design.create({
            id:user.id,
            user_id:user.id,
            name: name,
            gender:gender,
            age:age,
            status:status,
            major:major,
            work_experience:exps,
            content:content
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":design.id};
    },
    'PUT /api/design': async (ctx, next) => {
        var user=ctx.session.user;
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
         var id = ctx.request.body.id||'',
            name = ctx.request.body.name||'',
            gender = ctx.request.body.gender||'',
            age = ctx.request.body.age||'',
            status = ctx.request.body.status||'',
            major = ctx.request.body.major||'',
            exps = ctx.request.body.exps,
            content = ctx.request.body.content||'';

       
         var design = await Design.findById(id);
        design.name=name;
        design.gender=gender;
        design.age=age;
        design.status=status;
        design.major=major;
        design.work_experience=exps;
        design.content=content;

        await design.save();
         var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":design.id};
    },
    'PUT /api/designdetail': async (ctx, next) => {
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
        
        var design = await Design.findById(id);
        design.acreage=acreage;
        
        design.type_per_month=type_per_month;
        design.count_person=count_person;
        design.count_qc=count_qc;
        design.able_per_month=able_per_month;
        design.major=major;
        await design.save();
       
        ctx.body = {"code":"success","id":design.id};
    }
};
