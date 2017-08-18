module.exports = {
    //个人中心
    'GET /pay/payment': async (ctx, next) => {
        var user=ctx.session.user;
        ctx.render('./pay/payment.html',{user:user});
    },
    'GET /pay/result': async (ctx, next) => {
        
        ctx.render('./pay/success.html',{});
    }
};