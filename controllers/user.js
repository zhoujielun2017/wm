const crypto = require('crypto');
var User=require("../model/User");
var Util=require("../util/Util");

module.exports = {
    //个人中心
    'GET /user/center': async (ctx, next) => {
        var user=ctx.session.user;
        ctx.render('./user/center.html',{user:user});
    },
    'GET /user/buy': async (ctx, next) => {
        var user=ctx.session.user;
        ctx.render('./user/buy.html',{user:user});
    },
    //会员管理
    'GET /users': async (ctx, next) => {
        var user=ctx.session.user;
        var page=ctx.request.query.page||1;
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
    },
    'GET /manage/user': async (ctx, next) => {
        var id=ctx.request.query.id;
        var result;
        if(id){
            result = await User.findById(id);
        }
        ctx.render('./manage/user/add.html', {bean:result});
    },
    'GET /manage/user/:id': async (ctx, next) => {
        var id=ctx.request.params.id;
        var result;
        if(id){
            result = await User.findById(id);
        }
        ctx.render('./manage/user/add.html', {bean:result});
    },
    'GET /manage/users': async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await User.findAndCountAll({
            'limit': Util.pageSize,
            'offset': Util.pageSize*(page-1)
        });
        result.page=page;
        result.pageCount=Math.ceil(result.count/Util.pageSize);
        console.log(result);

        ctx.render('./manage/user/list.html', {
            result:result,
            page:Util.getPageNums(page,result.pageCount,"/manage/user")}
        );
    },
    'GET /api/user/email': async (ctx, next) => {
        var email=ctx.request.query.email;
        console.log("email",email);
        var result = await User.findOne({
            where:{
                'email': email    
            }
            
        });
        console.log(result);
        if(result){
            ctx.body=false;    
        }else{
            ctx.body=true;    
        }
        
    }
};