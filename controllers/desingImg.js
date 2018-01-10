var DesignImg=require("../model/DesignImg"),
    Design=require("../model/Design");

    var environment = async (ctx, next) => {
        var user=ctx.session.user;
        var design = await Design.findOne({
            where:{
                user_id:user.id
            }
        });
        //如果不存在,创建一个空的
        if(!design){
            design= await Design.create({
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
        var list = await DesignImg.findAll({
            design_id:design.id
        });
        
       
        ctx.render('./company/add_environment.html',{
            nav:"environment",
            bean:design,
            list:list
        });
    },
    environment_id = async (ctx, next) => {
        var id=ctx.params.id;
       
        var list = await DesignImg.findAll({
            design_id:id
        });
        
        ctx.render('./company/environment.html',{
            list:list
        });
    },
    add=async (ctx, next) => {

        var id = ctx.request.body.id,
            imgdescs = ctx.request.body.imgdescs||'',
            imgs = ctx.request.body.imgs||'';
        await DesignImg.destroy({
            where: {
                design_id:id
            }
        });
        var imgarr = imgs.split(",");
        var descarr = imgdescs.split("_@_");
        for (var i=0,len=imgarr.length;i<len;i++) {
            var img=imgarr[i];
            var imgdesc=descarr[i];
            var img=await DesignImg.create({
                design_id:id,
                img:img,
                content:imgdesc,
                sort:0
            });
        }
        
        ctx.body = {"code":"success"};
    };


module.exports = {
    'GET /designImg/:id': environment_id,
    'GET /designImg': environment,
    'POST /api/designImg': add
    
};