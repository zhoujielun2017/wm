var Ord=require("../model/Ord");
var db=require("../db");
var OrdPay=require("../model/OrdPay");
var Util=require("../util/Util");

module.exports = {
    'GET /ord': async (ctx, next) => {
        var user=ctx.session.user;
        var page=ctx.request.query.page||1;
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var result = await Ord.findAndCountAll({
            where: {
                user_id: user.id
            },
            'limit': Util.pageSize,
            'offset': Util.pageSize*(page-1)
        });
        result.page=page;
        result.pageCount=Math.ceil(result.count/Util.pageSize);
        console.log(result);

        ctx.render('./ord/list.html', {
            result:result,
            page:Util.getPageNums(page,result.pageCount,"/ord")}
        );
    },
    'POST /api/ord': async (ctx, next) => {

        var user=ctx.session.user;
        var name = ctx.request.body.name||"会员包年服务",
            sub_name = ctx.request.body.sub_name||"即日起购买会员一年送两个月",
            status = ctx.request.body.status,
            paytype = ctx.request.body.paytype;
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        
        var ord = await Ord.create({
            id:db.shortId(),
            user_id:user.id,
            name: name,
            sub_name:sub_name,
            status:0,
            amount:470000,
            end_time: new Date().getTime()
        });
        // var ordPay = await OrdPay.create({
        //     user_id:user.id,
        //     ord_id: ord.id,
        //     platform:paytype,
        //     status:0,
        //     outrade_no:""
        // });
        
        ctx.body = {"code":"success","id":ord.id};
    },
    'PUT /api/ord': async (ctx, next) => {
         
        var id = ctx.request.body.id;

       
        var ord = await Ord.findById(id);
        ord.status=1;
        
        await ord.save();
        
        ctx.body = {"code":"success","id":ord.id};
    }
    
};