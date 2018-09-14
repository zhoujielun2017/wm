var NavImg=require("../model/NavImg");

module.exports = {
   
    'GET /manage/navImg': async (ctx, next) => {
        var type=ctx.request.query.type||"indextop";
        var list = await NavImg.findAll({
            where:{
                type:type
            }
        });
        ctx.render('./manage/setting/navImg'+type+'.html', {list:list});
    },

    'POST /api/navImg': async (ctx, next) => {
         var name = ctx.request.body.name || '',
            img = ctx.request.body.img,
            type = ctx.request.body.type,
            url = ctx.request.body.url || '';
        var navImg = await NavImg.create({
            name: name,
            img: img,
            type:type,
            sort:0,
            url: url
        });
        ctx.response.body = {code:"success"};
    },
    'PUT /api/navImg': async (ctx, next) => {
         
         var id = ctx.request.body.id || '',
            type = ctx.request.body.type,
            urls = ctx.request.body.urls,
            imgs = ctx.request.body.imgs || '';

       var imgArr=imgs.split(",");
       var urlArr=urls.split(",");
       await NavImg.destroy({where:{
           type:type
       }});
       for(var i=0,len=imgArr.length;i<len;i++){
           var img=imgArr[i];
           var url=urlArr[i];
            var navImg = await NavImg.create({
                name: "",
                img: img,
                type:type,
                sort:i,
                url: url||""
            });
       }
       
       ctx.response.body = {code:"success"};
    },
    'DELETE /api/navImg': async (ctx, next) => {
         
        var id = ctx.request.body.id || '';
        var navImg = await NavImg.findById(id);
        await navImg.destroy();


        ctx.response.body = {code:"success"};
    }
};