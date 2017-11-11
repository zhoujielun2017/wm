const crypto = require('crypto'),
     User=require("../model/User"),
     Setting=require("../model/Setting"),
     PageUtil=require("../util/PageUtil");

var manage_user_id=async (ctx, next) => {
        var id=ctx.params.id;
        var result;
        if(id){
            result = await User.findById(id);
        }
        console.log("user",result);
        ctx.render('./manage/user/add.html', {bean:result});
    },
     user_center=async (ctx, next) => {
        var user=ctx.session.user;
        user = await User.findById(user.id);
        // console.log("user",user);
        ctx.render('./user/center.html',{user:user});
    },
     user_buy=async (ctx, next) => {
        var user=ctx.session.user;       
       
        var list = await Setting.findAll({});
        var setting={};
        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            setting[obj.id]=obj.value;
        }
        if(!user.type){
            user.type="seller";    
        }
        
        var price=setting['price_'+user.type];
           

        ctx.render('./user/buy.html',{user:user,price:price});
    },
    users=async (ctx, next) => {
        var user=ctx.session.user;
        var page=ctx.request.query.page||1;
        var list = await User.findAll({
            where:{
                
            },
            order: [['create_time', 'DESC']],
            offset: page, limit: 10
        });
        ctx.render('./user/list.html',{list:list});
    },
     user_id=async (ctx, next) => {
        var id=ctx.params.id,
            head_url = ctx.request.body.head_url;
        var user = await User.findById(id);
        
        
        user.head_url=head_url;
        await user.save();
        ctx.body={code:"success"};
    },
    uesr_id_email=async (ctx, next) => {
        var id=ctx.params.id;
        var email = ctx.request.body.email;
         var result = await User.findOne({
            where:{
                'email': email    
            }
            
        });
        // console.log(result);
        if(result){
             ctx.body={code:"exist"};
             return ;
        }
        var user = await User.findById(id);
        user.email=email;
        await user.save();
        ctx.body={code:"success"};
    },
    user_id_password=async (ctx, next) => {
        var id=ctx.params.id;
        var password = ctx.request.body.password,
            password2 = ctx.request.body.password2,
            time = ctx.request.body.time;
        var user = await User.findById(id);
        if(user.update_time!=time){
            ctx.body={code:"illegel"};
            return ;
        }
        password=crypto.createHash('md5').update(password).digest('hex');
        user.password=password;
        await user.save();
        ctx.body={code:"success"};
    },
    manage_user=async (ctx, next) => {
        var id=ctx.request.query.id;
        var result;
        if(id){
            result = await User.findById(id);
        }
        ctx.render('./manage/user/add.html', {bean:result});
    },
    manage_users=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await User.findAndCountAll({
             order: [['create_time', 'DESC']],
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });
       

        ctx.render('./manage/user/list.html', {
            result:result,
            page:PageUtil.getPage(page,result.count)}
        );
    },
    api_user_email=async (ctx, next) => {
        var email=ctx.request.query.email;
        // console.log("email",email);
        var result = await User.findOne({
            where:{
                'email': email    
            }
            
        });
        // console.log(result);
        if(result){
            ctx.body=false;    
        }else{
            ctx.body=true;    
        }

        
    },
    user_id_role_update=async (ctx, next) => {
        var id=ctx.params.id;
        var role = ctx.request.body.role;
        var user = await User.findById(id);
        user.verified=0;
        user.role=role;
        await user.save();
        ctx.body={code:"success"};
    },
    user_id_status_update=async (ctx, next) => {
        var id=ctx.params.id;
        var status = ctx.request.body.status;
        var user = await User.findById(id);
        user.status=status;
        await user.save();
        ctx.body={code:"success"};
    },
    api_user_id_delete=async (ctx, next) => {
        var id=ctx.params.id;
        var result;
         await User.destroy({
          where: {
            id:id
          }
        });
        ctx.response.body = {code:"success"};
    };

module.exports = {
    //个人中心
    'GET /user/center': user_center,
    //用户购买页
    'GET /user/buy': user_buy,
   
    //会员管理
    'GET /users': users,
    
    //更新用户
    'PUT /user/:id': user_id,
   
     //更新用户角色,审核
    'PUT /user/:id/role': user_id_role_update,
     //更新用户状态
    'PUT /user/:id/status': user_id_status_update,
     //更新用户邮箱
    'PUT /user/:id/email': uesr_id_email,
    
    //更新用户密码
    'PUT /user/:id/password': user_id_password,
    //后台用户
    'GET /manage/user': manage_user,
    //后台用户详情
    'GET /manage/user/:id':manage_user_id ,
    //后台用户列表
    'GET /manage/users': manage_users,
    
    //判断邮箱是否存在
    'GET /api/user/email': api_user_email,
    //删除用户
    'DELETE /api/user/:id': api_user_id_delete
};
