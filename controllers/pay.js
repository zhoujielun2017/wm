var Setting=require("../model/Setting");
module.exports = {
    //个人中心
    'GET /pay/payment': async (ctx, next) => {
        var user=ctx.session.user;
     
       
        var list = await Setting.findAll({});
        var setting={};
        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            setting[obj.id]=obj.value;
        }
        var price=setting['price_'+user.type];

        ctx.render('./pay/payment.html',{user:user,price:price});
    },
    'GET /pay/result': async (ctx, next) => {
        
        ctx.render('./pay/success.html',{});
    }
};