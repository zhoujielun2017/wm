const crypto = require('crypto');
var User=require("../model/User");



module.exports = {
    'GET /login/login': async (ctx, next) => {
        ctx.render('login.html',{});
    },
    'POST /login/login': async (ctx, next) => {
        // var id=ctx.params.id;        
        var email = ctx.request.body.email,
            password = ctx.request.body.password;
        if(!email||!password){
            ctx.body ={code:"param_null",data:"param is null"};
            return ;
        }            
        
        var user = await User.findOne({
          where: {
            email: email,
            password:password
          }
        });
        console.log(email+password);

        var user = await User.findOne({
          where: {
            email: email,
            password:password
          }
        });

        console.log(email+password);
        ctx.body ={code:"success"};
    },
    'GET /login/reg': async (ctx, next) => {
       
        ctx.render('reg.html',{});
    },
    'POST /login/reg': async (ctx, next) => {
        var email = ctx.request.body.email,
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
            password:password,
            verified:0,
            head_url: ""
        });

        ctx.body ={code:"success"};
    },
    //邀请码从邮箱过来
    'GET /login/fromemail': async (ctx, next) => {
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
        ctx.session.user = user;
        ctx.render('./user/email_sucess.html',{});
    },
    'GET /login/forget': async (ctx, next) => {
        ctx.render('./user/forget.html',{});
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