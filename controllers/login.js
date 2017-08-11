var User=require("../model/User");

module.exports = {
    'GET /login/in': async (ctx, next) => {
        // var id=ctx.params.id;
        // var article = await User.findById(id);

        // console.log(article);
        ctx.render('login.html',{});
    }
    
};