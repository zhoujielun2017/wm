const crypto = require('crypto'),
     User=require("../model/User"),
     Setting=require("../model/Setting"),
     Util=require("../util/Util");

var manage_user_id=async (ctx, next) => {
        var id=ctx.request.params.id;
        var result;
        if(id){
            result = await User.findById(id);
        }
        console.log("user",result);
        ctx.render('./manage/user/add.html', {bean:result});
    }

module.exports = {
    //个人中心
    'GET /user/center': async (ctx, next) => {
        var user=ctx.session.user;
        user = await User.findById(user.id);
        // console.log("user",user);
        ctx.render('./user/center.html',{user:user});
    },
    'GET /user/buy': async (ctx, next) => {
        var user=ctx.session.user;       
       
        var list = await Setting.findAll({});
        var setting={};
        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            setting[obj.id]=obj.value;
        }
        var price=setting['price_'+user.type];
           

        ctx.render('./user/buy.html',{user:user,price:price});
    },
    //会员管理
    'GET /users': async (ctx, next) => {
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
    //更新用户
    'PUT /user/:id': async (ctx, next) => {
        var id=ctx.params.id,
            head_url = ctx.request.body.head_url;
        var user = await User.findById(id);
        
        
        user.head_url=head_url;
        await user.save();
        ctx.body={code:"success"};
    },
     //更新用户角色
    'PUT /user/:id/role': async (ctx, next) => {
        var id=ctx.params.id;
        var role = ctx.request.body.role;
        var user = await User.findById(id);
        user.verified=0;
        user.role=role;
        await user.save();
        ctx.body={code:"success"};
    },
     'PUT /user/:id/verified': async (ctx, next) => {
         var id=ctx.params.id;
         var verified = ctx.request.body.verified;
         var user = await User.findById(id);
         user.verified=1;
         await user.save();
         ctx.body={code:"success"};
     },
     //更新用户邮箱
    'PUT /user/:id/email': async (ctx, next) => {
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
    //更新用户密码
    'PUT /user/:id/password': async (ctx, next) => {
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
    'GET /manage/user': async (ctx, next) => {
        var id=ctx.request.query.id;
        var result;
        if(id){
            result = await User.findById(id);
        }
        ctx.render('./manage/user/add.html', {bean:result});
    },
    'GET /manage/user/:id':manage_user_id ,
    'GET /manage/users': async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await User.findAndCountAll({
            'limit': Util.pageSize,
            'offset': Util.pageSize*(page-1)
        });
        result.page=page;
        result.pageCount=Math.ceil(result.count/Util.pageSize);
        // console.log(result);

        ctx.render('./manage/user/list.html', {
            result:result,
            page:Util.getPageNums(page,result.pageCount,"/manage/user")}
        );
    },
    //判断邮箱是否存在
    'GET /api/user/email': async (ctx, next) => {
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
        
    }
};
