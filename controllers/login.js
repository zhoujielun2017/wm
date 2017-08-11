// const session = require('koa-session');
var User=require("../model/User");

module.exports = {
    'GET /login': async (ctx, next) => {
        // var id=ctx.params.id;
        // var article = await User.findById(id);

        // console.log(article);

        ctx.render('login.html',{});
    },
    'POST /login': async (ctx, next) => {
        // var id=ctx.params.id;        
         var email = ctx.request.body.email || '',
            password = ctx.request.body.password || '';
   
        console.log(email+password);

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
        ctx.body ={code:"success"};
    },
    'GET /reg': async (ctx, next) => {
        let n = ctx.session.views || 0;
        ctx.session.views = ++n;
        ctx.body = n + ' views';
        // ctx.render('reg.html',{});
    },
    'GET /reg2': async (ctx, next) => {
        let n = ctx.session.views || 0;
        ctx.session.views = ++n;
        ctx.body = n + ' views';
        // ctx.render('reg.html',{});
    },
    'POST /reg': async (ctx, next) => {
        ctx.body ={code:"success"};
    }
};