var Works=require("../model/Works"),
    DesignImg=require("../model/DesignImg");
var PageUtil=require("../util/PageUtil");

var works_id=async (ctx, next) => {
        var id = ctx.params.id;
        var bean = await Works.findById(id);
        var list = await DesignImg.findAll({where:{
            design_id:id
        }});
        ctx.render('./works/detail.html', {bean:bean,list:list});
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
        
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }

        var list = await Works.findAll({
            where: {
                user_id: user.id
            },
             order: [['sort', 'ASC']]
        });
        
        ctx.render('./works/list.html', {
            list:list});

    },
    api_works_add=async (ctx,next) => {
        var user=ctx.session.user;
        var titles = ctx.request.body.titles||'',
        types = ctx.request.body.types||'',
        materials = ctx.request.body.materials||'',
        prices = ctx.request.body.prices||'',
        descs = ctx.request.body.descs||'',
        imgs = ctx.request.body.imgs||'';
        await Works.destroy({
            where: {
                user_id:user.id
            }
        });
        var imgarr = imgs.split(",");
        var pricearr = prices.split(",");
        var descarr = descs.split("_@_");
        var titlearr = titles.split("_@_")
        var typearr = types.split("_@_");
        var materialarr = materials.split("_@_");
        for (var i=0,len=imgarr.length;i<len;i++) {
            var img=imgarr[i]||"";
            if(!img){
                continue;
            }
            var desc=descarr[i]||"";
            var title=titlearr[i]||"";
            var material=materialarr[i]||"";
            var type=typearr[i]||"";
            var price=pricearr[i]||0;
            var work = await Works.create({
                user_id:user.id,
                title: title,
                type: type,
                price:price*100,//转成分
                material:material,
                default_img:img,
                imgs:img,
                status:1,
                sort:i,
                content: desc
            });
        }
        
        ctx.body = {"code":"success"};
    },
    works_add=async (ctx, next) => {
        var user=ctx.session.user;
        var id=ctx.request.query.id;
        if(!user){
            ctx.response.redirect('/login/login');
            return ;
        }
        
        if(id){
            var works = await Works.findById(id);
        }
        if(works){
            var list=await DesignImg.findAll({where:{
                design_id:id
            }})
        }
        ctx.render('./works/add.html',{bean:works,list:list});
    },
    api_works_update=async (ctx, next) => {
         
        var id = ctx.request.body.id||'',
            title = ctx.request.body.title||'',
            material = ctx.request.body.material||'',
            price = ctx.request.body.price||0,
            imgs = ctx.request.body.imgs,
            imgdescs = ctx.request.body.imgdescs,
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
        
        var imgarr=imgs.split(",");
        var descarr=imgdescs.split("_@_");
        await DesignImg.destroy({
            where: {
                design_id:id
            }
          });
        for (var i=0,len=imgarr.length;i<len;i++) {
            var img=imgarr[i];
            var imgdesc=descarr[i];
            var img=await DesignImg.create({
                design_id:id,
                img:img,
                content:imgdesc,
                sort:0
            });
        }

        ctx.body = {"code":"success","id":works.id};
    }
module.exports = {
   
    //产品列表页
    'GET /works': works,
    //产品添加页
    'GET /works/add': works_add,
     //作品详情页
     'GET /works/:id': works_id,
    //添加作品
    'POST /api/works': api_works_add,
    //更新作品
    'PUT /api/works': api_works_update,
    //删除作品
    'DELETE /api/works/:id': api_works_delete
};