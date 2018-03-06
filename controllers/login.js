const crypto = require('crypto'),
    mail = require('../mail'),
    config = require('../config'),
    User=require("../model/User");

var regContent="<h3>Dear Account, Welcome to acclist.com!</h3>";
    regContent+="<p>To guarantee you can experience the service of acclist.com, please activate your account within 24 hours.</p>";
    regContent+="<p>Please click on below link. You will be prompt to login.</p>";
    regContent+="<p><a href='__url' target='_blank'>__url</a></p>";
    regContent+="<p>If you fail to click the above link, please copy it to your browser and confirm.</p>";

var forgetContent="<h3>Reset Password</h3>";
    forgetContent+="<p>重置密码请点击下面的地址:</p>";
    forgetContent+="<p>Please click on below link to reset your password.</p>";
    forgetContent+="<p><a href='__url' target='_blank'>__url</a></p>";
    forgetContent+="<p>If you fail to click the above link, please copy it to your browser and confirm.</p>";

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
        if(!user.status){
            ctx.body ={code:"not_active"};
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
        var user = await User.findOne({
          where: {
            email: email
          }
        });
        if(user){
            ctx.body ={code:"exists"};
            return;
        }
        password=crypto.createHash('md5').update(password).digest('hex');
        var user = await User.create({
            role:0,
            email: email,
            name:email,
            status:0,
            type:type,
            password:password,
            verified:0,
            head_url: "",
            last_login_time:Date.now()
        });
        var url="http://"+config.web.domain+"/login/fromemail?email="+email+"&pass="+password+"&time="+user.update_time;

        console.log("发送注册邮件");
        let mailOptions = {
            from: '"service@acclist" <service@acclist.com>', // sender address
            to: email, // list of receivers
            subject: '帐号激活', // Subject line
            text: regContent.replace(/__url/g,url), // plain text body
            html: regContent.replace(/__url/g,url) // html body
        };
        mail.send(mailOptions);
        ctx.body ={code:"success",id:user.id};
    },
    //注册邀请码从邮箱过来
    'GET /login/fromemail': async (ctx, next) => {
        var email = ctx.request.query.email,
            password = ctx.request.query.pass,
            time = ctx.request.query.time;
        //console.log("param",ctx.request.query);
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
        // if(user.update_time!=time){
        //     ctx.render('./user/reg_email_fail.html',{msg:"邀请链接已经过期"});
        //     return;
        // }
        if(user){
             user.status=1;
            user.update_time = Date.now();
            await user.save();    
            ctx.session.user = user;
        }
       
        ctx.render('./user/reg_email_sucess.html',{});
    },
    'GET /login/sendemail': async (ctx, next) => {
        var id = ctx.request.query.id;
        var user = await User.findById(id);
        // login/fromemail?email=11@22&pass=2222&time=1502549978197
        var token=crypto.createHash('md5').update(id+user.password).digest('hex');
        var email=user.email;
        user.email=email.substring(email.indexOf("@")+1,email.length);
        ctx.render('./user/email_send_sucess.html',{bean:user,token:token});
    },
    'GET /login/sendforgetemail': async (ctx, next) => {
        var id = ctx.request.query.id;
        var user = await User.findById(id);
        // login/fromemail?email=11@22&pass=2222&time=1502549978197
        var token=crypto.createHash('md5').update(id+user.password).digest('hex');
        var email=user.email;
        user.email=email.substring(email.indexOf("@")+1,email.length);
        ctx.render('./user/forget_email_send_sucess.html',{bean:user,token:token});
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

        // http://localhost:8080/login/reset?email=xx@163.com&pass=719130ba7c4c085f24bc5f67754c0730&time=1506353244219
        var url="http://"+config.web.domain+"/login/reset?email="+email+"&pass="+user.password+"&time="+user.update_time;
        //TODO 发送邮件
        console.log("发送忘记密码邮件");
        let mailOptions = {
            from: '"service@acclist" <service@acclist.com>', // sender address
            to: email, // list of receivers
            subject: '重置密码', // Subject line
            text: forgetContent.replace(/__url/g,url), // plain text body
            html: forgetContent.replace(/__url/g,url) // html body
        };
        mail.send(mailOptions);
        ctx.body ={code:"success",id:user.id};
    },
    //重置密码页 
    'GET /login/reset': async (ctx, next) => {
        var email = ctx.request.query.email,
            password = ctx.request.query.pass,
            time = ctx.request.query.time;
        //console.log("param",ctx.request.query);
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
        //进入这个页面，让练级不失效
        // user.update_time = Date.now();
        // await user.save();    

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