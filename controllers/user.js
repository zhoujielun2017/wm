const crypto = require('crypto');
var User=require("../model/User");

module.exports = {
    //个人中心
    'GET /user/center': async (ctx, next) => {
        var user=ctx.session.user;
        ctx.render('./user/center.html',{user:user});
    },
    //会员管理
    'GET /users': async (ctx, next) => {
        var user=ctx.session.user;
        var page=ctx.request.query.page||1;
        // if(!user){
        //     ctx.response.redirect('/login/login');
        //     return;
        // }
        var list = await User.findAll({
            where:{
                
            },
            order: [['create_time', 'DESC']],
            offset: page, limit: 10
        });
        ctx.render('./user/list.html',{list:list});
    },
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
    }
};