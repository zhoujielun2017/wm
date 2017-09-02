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
        ctx.render('./user/email_send_sucess.html',{bean:user});
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
        ctx.body ={code:"success"};
    },
    'GET /login/reset': async (ctx, next) => {
        var email = ctx.request.query.email,
            password = ctx.request.query.pass,
            time = ctx.request.query.time;
        console.log("param",ctx.request.query);
        if(!email||!password||!time){
            ctx.render('./user/email_fail.html',{msg:"邀请链接错误"});
            return;
        }
        var user = await User.findOne({
          where: {
            email: email,
            password:password
          }
        });
        if(user.update_time!=time){
            ctx.render('./user/email_fail.html',{msg:"邀请链接已经过期"});
            return;
        }
        user.update_time = Date.now();
        await user.save();    
        ctx.render('./user/reset.html',{user:user});
    }
};