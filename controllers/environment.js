var Environment=require("../model/Environment"),
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
        var bean = await Environment.findById(factory.id);
        if(!bean){
            bean = await Environment.create({id:factory.id,imgs:""});
        }
        bean.imgs=bean.imgs.split(",");
        ctx.render('./company/add_environment.html',{
            nav:"environment",
            bean:bean
        });
    },
    environment_id = async (ctx, next) => {
        var id=ctx.params.id;
       
        var bean = await Environment.findById(id);
        
        bean.imgs=bean.imgs.split(",");
        ctx.render('./company/environment.html',{
            bean:bean
        });
    },
    add=async (ctx, next) => {

        var id = ctx.request.body.id,
            imgs = ctx.request.body.imgs;
        var bean = await Environment.findById(id);
        bean.imgs=imgs;
        await bean.save();
        ctx.body = {"code":"success"};
    };


module.exports = {
    'GET /environment/:id': environment_id,
    'GET /environment': environment,
    'PUT /api/environment': add
    
};