var NavImg=require("../model/NavImg");

module.exports = {
   
    'GET /manage/navImg': async (ctx, next) => {
        var list = await NavImg.findAll();
        ctx.render('./manage/setting/navImg.html', {list:list});
    },
    'POST /api/navImg': async (ctx, next) => {
         var name = ctx.request.body.name || '',
            img = ctx.request.body.img
            url = ctx.request.body.url || '';
        var navImg = await NavImg.create({
            name: name,
            img: img,
            sort:0,
            url: url
        });
        //console.log('created: ' + JSON.stringify(navImg));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({code:"success"});
    },
    'PUT /api/navImg': async (ctx, next) => {
         
         var id = ctx.request.body.id || '',
            imgs = ctx.request.body.imgs || '';

       var imgArr=imgs.split(",");
       await NavImg.destroy({where:{}});
       for(var i=0,len=imgArr.length;i<len;i++){
           var img=imgArr[i];
            var navImg = await NavImg.create({
                name: "",
                img: img,
                sort:i,
                url: ""
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