const crypto = require('crypto');
var User=require("../model/User");



module.exports = {
    'GET /login/login': async (ctx, next) => {
        ctx.render('./user/login.html',{});
    },
    //登陆
    'POST /login/login': async (ctx, next) => { 
        var email = ctx.request.body.email,
            password = ctx.request.body.password;
        if(!email||!password){
            ctx.body ={code:"param_null",data:"param is null"};
            return ;
        }            
        password=crypto.createHash('md5').update(password).digest('hex');
        var user = await User.findOne({
          where: {
            email: email,
            password:password
          }
        });

        if(!user){
            ctx.body ={code:"not_found"};
            return;
        }
        user.last_login_time=Date.now();
        user.save();
        ctx.session.user = user;
        ctx.body ={code:"success"};
    },
    //登陆
    'DELETE /login/login': async (ctx, next) => { 

        ctx.session.user = null;
        ctx.body ={code:"success"};
    },
    'GET /login/reg': async (ctx, next) => {
        //邮件发送 https://help.aliyun.com/document_detail/29440.html?spm=5176.doc29439.6.574.JGrkVV
        ctx.render('./user/reg.html',{});
    },
    'POST /login/reg': async (ctx, next) => {
        var email = ctx.request.body.email,
            type = ctx.request.body.type,
            password = ctx.request.body.password;
        if(!email||!password){
            ctx.body ={code:"param_null"};
            return;
        }
        password=crypto.createHash('md5').update(password).digest('hex');
        var user = await User.create({
            role:0,
            email: email,
            name:email,
            type:type,
            password:password,
            verified:0,
            head_url: "",
            last_login_time:Date.now()
        });

        ctx.body ={code:"success",id:user.id};
    },
    //注册邀请码从邮箱过来
    'GET /login/fromemail': async (ctx, next) => {
        var email = ctx.request.query.email,
            password = ctx.request.query.pass,
            time = ctx.request.query.time;
        console.log("param",ctx.request.query);
        if(!email||!password||!time){
            ctx.render('./user/reg_email_fail.html',{msg:"邀请链接错误"});
            return;
        }
        var user = await User.findOne({
          where: {
            email: email,
            password:password
          }
        });
        if(user.update_time!=time){
            ctx.render('./user/reg_email_fail.html',{msg:"邀请链接已经过期"});
            return;
        }
        user.update_time = Date.now();
        await user.save();    
        ctx.session.user = user;
        ctx.render('./user/reg_email_sucess.html',{});
    },
    'GET /login/sendemail': async (ctx, next) => {
        var id = ctx.request.query.id;
        var user = await User.findById(id);
        // login/fromemail?email=11@22&pass=2222&time=1502549978197
        var token=crypto.createHash('md5').update(id+user.password).digest('hex');

        ctx.render('./user/email_send_sucess.html',{bean:user,token:token});
    },
    //忘记密码页面
    'GET /login/forget': async (ctx, next) => {
        ctx.render('./user/forget.html',{});
    },
    //忘记密码发送链接
    'POST /login/forget': async (ctx, next) => {
        var email = ctx.request.body.email;
        var user = await User.findOne({
          where: {
            email: email
          }
        });
        if(!user){
            ctx.body ={code:"not_exist"};
            return;
        }
        //TODO 发送邮件
        ctx.body ={code:"success",id:user.id};
    },
    //重置密码页 
    'GET /login/reset': async (ctx, next) => {
        var email = ctx.request.query.email,
            password = ctx.request.query.pass,
            time = ctx.request.query.time;
        console.log("param",ctx.request.query);
        if(!email||!password||!time){
            ctx.render('./user/reset_email_fail.html',{msg:"邀请链接错误"});
            return;
        }
        var user = await User.findOne({
          where: {
            email: email,
            password:password
          }
        });

        if(user.update_time!=time){
            ctx.render('./user/reset_email_fail.html',{msg:"邀请链接已经过期"});
            return;
        }
        user.update_time = Date.now();
        await user.save();    

        var token=crypto.createHash('md5').update(user.id+user.password).digest('hex');
        ctx.render('./user/reset.html',{bean:user,token:token});
    },
    //重置密码
    'POST /login/reset': async (ctx, next) => {
        var id = ctx.request.body.id,
            token = ctx.request.body.token,
            password = ctx.request.body.password,
            password2 = ctx.request.body.password2;
        if(password!=password2){
            ctx.body ={code:"param_not_equal",data:"param not equal"};
            return ;
        } 
        var user = await User.findById(id);
        //id+旧密码 作为token
        var tokenMd5=crypto.createHash('md5').update(id+user.password).digest('hex');
        if(tokenMd5!=token){
             ctx.body ={code:"token_not_equal",data:"token not equal"};
            return ;
        }
        password=crypto.createHash('md5').update(password).digest('hex');
       
        user.password=password;
        await user.save();    
        ctx.body ={code:"success"};
    }
};