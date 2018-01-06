var FactoryImg=require("../model/FactoryImg"),
    Factory=require("../model/Factory");

    var environment = async (ctx, next) => {
        var user=ctx.session.user;
        var factory = await Factory.findOne({
            where:{
                user_id:user.id
            }
        });
        //如果不存在,创建一个空的
        if(!factory){
            factory= await Factory.create({
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
        var list = await FactoryImg.findAll({
            factory_id:factory.id
        });
        
       
        ctx.render('./company/add_environment.html',{
            nav:"environment",
            bean:factory,
            list:list
        });
    },
    environment_id = async (ctx, next) => {
        var id=ctx.params.id;
       
        var list = await FactoryImg.findAll({
            factory_id:factory.id
        });
        
        ctx.render('./company/environment.html',{
            list:list
        });
    },
    add=async (ctx, next) => {

        var id = ctx.request.body.id,
            imgdescs = ctx.request.body.imgdescs||'',
            imgs = ctx.request.body.imgs||'';
        await FactoryImg.destroy({
            where: {
                factory_id:id
            }
        });
        var imgarr = imgs.split(",");
        var descarr = imgdescs.split("_@_");
        for (var i=0,len=imgarr.length;i<len;i++) {
            var img=imgarr[i];
            var imgdesc=descarr[i];
            var img=await FactoryImg.create({
                factory_id:id,
                img:img,
                content:imgdesc,
                sort:0
            });
        }
        
        ctx.body = {"code":"success"};
    };


module.exports = {
    'GET /environment/:id': environment_id,
    'GET /environment': environment,
    'POST /api/environment': add
    
};