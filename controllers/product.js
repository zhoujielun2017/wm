var Product=require("../model/Product"),
    ProductImg=require("../model/ProductImg"),
    PageUtil=require("../util/PageUtil");

var product_id=async (ctx, next) => {
        var id = ctx.params.id;
        var bean = await Product.findById(id);
        if(!bean){
            ctx.render('./404.html');
            return ;
        }
        if(bean&&bean.price){
            bean.price=(bean.price/100).toFixed(2);
        }
        
        bean.imgs=bean.imgs.split(",");
        var list = await ProductImg.findAll({where:{
            product_id:id
        }});

        ctx.render('./product/detail.html', {bean:bean,list:list});
    },

    product=async (ctx, next) => {
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
       for (var i = 0,len=result.count; i < len; i++) {
            var bean=result.rows[i];
            
            if(bean&&bean.price){
                bean.price=(bean.price/100).toFixed(2);
            }
           
            
            
       }
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
            product.price=(product.price/100).toFixed(2);
            var list=await ProductImg.findAll({where:{
                product_id:id
            }})
        }
        ctx.render('./product/add.html',{bean:product,list:list});
    },
    api_product_update=async (ctx, next) => {
         
         var id = ctx.request.body.id||'',
            title = ctx.request.body.title||'',
            material = ctx.request.body.material||'',
            price = ctx.request.body.price||0,
            imgs = ctx.request.body.imgs,
            imgdescs = ctx.request.body.imgdescs,
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

        var imgarr=imgs.split(",");
        var descarr=imgdescs.split("_@_");
        await ProductImg.destroy({
            where: {
                product_id:id
            }
          });
        for (var i=0,len=imgarr.length;i<len;i++) {
            var img=imgarr[i];
            var imgdesc=descarr[i];
            var img=await ProductImg.create({
                product_id:id,
                img:img,
                content:imgdesc,
                sort:0
            });
        }

        ctx.body = {"code":"success","id":product.id};
    },
    api_product=async (ctx, next) => {

        var user=ctx.session.user;
        var title = ctx.request.body.title||'',
            material = ctx.request.body.material||'',
            price = ctx.request.body.price||0,
            imgs = ctx.request.body.imgs,
            imgdescs = ctx.request.body.imgdescs,
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
        var imgarr=imgs.split(",");
        var descarr=imgdescs.split("_@_");
        for (var i=0,len=imgarr.length;i<len;i++) {
            var img=imgarr[i];
            var imgdesc=descarr[i];
            var img=await ProductImg.create({
                product_id:product.id,
                img:img,
                content:imgdesc,
                sort:0
            });
        }
        
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
    },
    product_init=async (ctx, next) => {
        
       var list = await Product.findAll({});
       for (var i=0,len=list.length;i<len;i++) {
           var bean = list[i];
           var imgarr=bean.imgs.split(",");

           for (var j=0,lenn=imgarr.length;j<lenn;j++) {
               var img=imgarr[j];
               if(img){
                   
                    await ProductImg.create({
                        product_id:bean.id,
                        img:img,
                        content:"",
                        sort:0
                    });
                }
            }
        }
        
    
       ctx.body = {"code":"success"};
   }
module.exports = {
     //产品添加页,要在:id的前面
    'GET /product/add': product_add,
    'GET /product/init': product_init,
    //产品详情
    'GET /product/:id': product_id,
    
    //前台产品列表页
    'GET /product': product,
   
    'POST /api/product': api_product,
    'PUT /api/product': api_product_update,
    
    'DELETE /api/product/:id': api_product_delete
};