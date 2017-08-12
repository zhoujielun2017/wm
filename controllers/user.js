const crypto = require('crypto');
var User=require("../model/User");

module.exports = {
    //个人中心
    'GET /user': async (ctx, next) => {
       
        ctx.render('./user/user.html',{});
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