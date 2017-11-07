var Cooperation=require("../model/Cooperation");
var Factory=require("../model/Factory");

var major=[
   "major_xiaolv",
    "major_zhiliang",
    "major_kuanshi",
    "major_zhizi",
    "major_caoliu",
];
 

module.exports = {
    'GET /cooperation': async (ctx, next) => {
        var user=ctx.session.user;
        //console.log(user);
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var company = await Factory.findById(user.id);
        if(company&&company.major){
            company.major=company.major.split(",");
        }
        var list = await Cooperation.findAll({
            where: {
                user_id: user.id
            }
        });
        var customer=[];
        var factory=[];
        for (var i = 0; i < list.length; i++) {
            if(list[i].type=='factory'){
                factory.push(list[i]);
            }
            if(list[i].type!='factory'){
                customer.push(list[i]);
            }
        }
        ctx.render('./company/cooperation.html',{bean:company,
            list:list,customer:customer,factory:factory,major:major});
    },
    'POST /api/cooperation': async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            type = ctx.request.body.type||'';
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        
        var cooperation = await Cooperation.create({
            user_id:user.id,
            name: name,
            type:type
        });
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":cooperation.id};
    },
    'PUT /api/cooperation': async (ctx, next) => {
         var user=ctx.session.user;
         var id = ctx.request.body.id||'',
            name = ctx.request.body.name||'',
            type = ctx.request.body.type||'';

       
         var cooperation = await Cooperation.findById(id);
        cooperation.name=name;
        cooperation.type=type;
        
        await cooperation.save();
        var dbUser = await User.findById(user.id);
        dbUser.name=name;
        dbUser.save();
        ctx.body = {"code":"success","id":cooperation.id};
    },
    'DELETE /api/cooperation': async (ctx, next) => {
         
        var id = ctx.params.id;
        var data = await Cooperation.findById(id);
        
        ctx.body = {code:"success"};
    }
};