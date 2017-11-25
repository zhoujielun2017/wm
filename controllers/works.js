var Works=require("../model/Works");
var PageUtil=require("../util/PageUtil");

var works_id=async (ctx, next) => {
        var id = ctx.params.id;
        var bean = await Works.findById(id);
        bean.imgs=bean.imgs.split(",");
        ctx.render('./works/detail.html', {bean:bean});

    },
    api_works_delete=async (ctx, next) => {
         
        var id = ctx.params.id;
        await Works.destroy({
          where: {
            id:id
          }
        });
        ctx.body = {"code":"success"};
    },
    works=async (ctx, next) => {
        var user=ctx.session.user;
        var page=ctx.request.query.page||1;
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var result = await Works.findAndCountAll({
            where: {
                user_id: user.id
            },
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1),
            order: [['create_time', 'DESC']]
        });
      
        ctx.render('./works/list.html', {
            result:result,
            page:PageUtil.getPage(page,result.count)}
        );

    },
    works_add=async (ctx, next) => {
        var user=ctx.session.user;
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var id=ctx.request.query.id;
        
        if(id){
            var works = await Works.findById(id);
        }
        if(works){
            works.imgs=works.imgs.split(",");
        }
        ctx.render('./works/add.html',{bean:works});
    },
    api_works_add=async (ctx, next) => {

        var user=ctx.session.user;
        var title = ctx.request.body.title||'',
            material = ctx.request.body.material||'',
            price = ctx.request.body.price||0,
            imgs = ctx.request.body.imgs,
            content = ctx.request.body.content||'';
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        console.log("test user:",user.id);
        var works = await Works.create({
            user_id:user.id,
            title: title,
            price:price,
            material:material,
            default_img:imgs.split(",")[0],
            imgs:imgs,
            status:1,
            content: content
        });
        
        ctx.body = {"code":"success","id":works.id};
    },
    api_works_update=async (ctx, next) => {
         
        var id = ctx.request.body.id||'',
            title = ctx.request.body.title||'',
            material = ctx.request.body.material||'',
            price = ctx.request.body.price||0,
            imgs = ctx.request.body.imgs,
            default_img,
            content = ctx.request.body.content||'';

       
       if(~imgs.indexOf(",")){
            default_img=imgs.slice(0,imgs.indexOf(","));
        }else{
            default_img=imgs;
        }

        var works = await Works.findById(id);
        works.title=title;
        works.material=material;
        works.price=price;
        works.imgs=imgs;
        works.default_img=default_img;
        works.content=content;
        await works.save();
        
        ctx.body = {"code":"success","id":works.id};
    }
module.exports = {
    //作品详情页
    'GET /works/:id': works_id,
    //产品列表页
    'GET /works': works,
    //产品添加页
    'GET /works/add': works_add,
    //添加作品
    'POST /api/works': api_works_add,
    //更新作品
    'PUT /api/works': api_works_update,
    //删除作品
    'DELETE /api/works/:id': api_works_delete
};