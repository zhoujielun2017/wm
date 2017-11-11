var Product=require("../model/Product");
var PageUtil=require("../util/PageUtil");

var product=async (ctx, next) => {
        var user=ctx.session.user;
        var page=ctx.request.query.page||1;
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var result = await Product.findAndCountAll({
            where: {
                user_id: user.id
            },
             order: [['create_time', 'DESC']],
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1)
        });

        ctx.render('./product/list.html', {
            result:result,
            page:PageUtil.getPage(page,result.count)}
        );

    },
    product_add=async (ctx, next) => {
        var user=ctx.session.user;
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        var id=ctx.request.query.id;
        var product = {};
        if(id){
            product = await Product.findById(id);
            product.imgs=product.imgs.split(",");
        }
        ctx.render('./product/add.html',{bean:product});
    },
    api_product_update=async (ctx, next) => {
         
         var id = ctx.request.body.id||'',
            title = ctx.request.body.title||'',
            material = ctx.request.body.material||'',
            price = ctx.request.body.price||0,
            imgs = ctx.request.body.imgs,
            content = ctx.request.body.content||'';
        var default_img;
        if(~imgs.indexOf(",")){
            default_img=imgs.slice(0,imgs.indexOf(","));
        }else{
            default_img=imgs;
        }
       
         var product = await Product.findById(id);
        product.title=title;
        product.material=material;
        product.price=price*100;
        product.imgs=imgs;
        product.default_img=default_img;
        product.content=content;
        await product.save();
        
        ctx.body = {"code":"success","id":product.id};
    },
    api_product=async (ctx, next) => {

        var user=ctx.session.user;
        var title = ctx.request.body.title||'',
            material = ctx.request.body.material||'',
            price = ctx.request.body.price||0,
            imgs = ctx.request.body.imgs,
            content = ctx.request.body.content||'',
            default_img=null;
        if(!user){
            ctx.body = {"code":"not_login"};
            return;
        }
        
        
        if(~imgs.indexOf(",")){
            default_img=imgs.split(",")[0];
        }else{
            default_img=imgs;
        }
       
        var product = await Product.create({
            
            user_id:user.id,
            title: title,
            price:price*100,
            material:material,
            default_img:default_img,
            imgs:imgs,
            status:1,
            content: content
        });
        
        ctx.body = {"code":"success","id":product.id};
    },
    api_product_delete=async (ctx, next) => {
         
        var id = ctx.params.id;
        await Product.destroy({
          where: {
            id:id
          }
        });
        ctx.body = {"code":"success"};
    }
module.exports = {
    //产品详情
    // 'GET /product/:id': async (ctx, next) => {
    //     var id = ctx.params.id;
    //     var bean = await Product.findById(id);
       
    //     ctx.render('./product/detail.html', {bean:bean});

    // },
    //前台产品列表页
    'GET /product': product,
    //产品添加页
    'GET /product/add': product_add,
    
    'POST /api/product': api_product,
    'PUT /api/product': api_product_update,
    
    'DELETE /api/product/:id': api_product_delete
};