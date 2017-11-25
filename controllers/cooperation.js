var Cooperation=require("../model/Cooperation");
var Factory=require("../model/Factory");

var major=[
    "brass",
	"zink",
	"chain",
	"ribbon",
	"semi",
	"glass",
	"resin",
	"acrylic",
	"pearl",
	"shall",
	"wood"
];

var cooperation=async (ctx, next) => {
        var user=ctx.session.user;
        var company = await Factory.findOne({
            where:{
                user_id:user.id
            }
        });
        //如果不存在,创建一个空的
        if(!company){
             company=await Factory.create({
                user_id:user.id,
                name: "",
                ename:"",
                address:"",
                legal_person:"",
                phone:"",
                custom_service:"",
                email:"",
                build_time:null,
                area:"",
                content: ""
            });
        }
        if(company&&company.major){
            company.major=company.major.split(",");
        }
        var list = await Cooperation.findAll({
            where: {
                factory_id: company.id
            }
        });
        var customer=[];
        var factory=[];
        //处理合作信息
        for (var i = 0; i < list.length; i++) {
            if(list[i].type=='factory'){
                factory.push(list[i]);
            }
            if(list[i].type!='factory'){
                customer.push(list[i]);
            }
        }
        ctx.render('./company/cooperation.html',{
            bean:company,
            list:list,
            customer:customer,
            factory:factory,
            major:major});
    },
    //添加合作商
    api_cooperation=async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||'',
            factory_id = ctx.request.body.factory_id,
            type = ctx.request.body.type||'';
        var factory = await Factory.findOne({
            where:{
                user_id:user.id
            }
        });
        var cooperation = await Cooperation.create({
            factory_id:factory_id,
            name: name,
            type:type
        });
       
        ctx.body = {"code":"success","id":cooperation.id};
    }, 
    api_cooperation_update=async (ctx, next) => {
         var user=ctx.session.user;
         var coopid = ctx.request.body.coopid||'',
            name = ctx.request.body.name||'',
            type = ctx.request.body.type||'';
        
        var cooperation = await Cooperation.findById(coopid);
        cooperation.name=name;
        cooperation.type=type;
        await cooperation.save();
       
        ctx.body = {"code":"success","id":coopid};
    },
    api_cooperation_delete=async (ctx, next) => {
         
        var id = ctx.request.body.id;
        var data = await Cooperation.findById(id);
        if(data){
            await data.destroy();
        }
       
        ctx.body = {code:"success"};
    }
module.exports = {
    'GET /cooperation': cooperation,
    
    //添加合作商
    'POST /api/cooperation': api_cooperation,
    //更新合作商
    'PUT /api/cooperation': api_cooperation_update,
    //删除合作商
    'DELETE /api/cooperation': api_cooperation_delete
    
};