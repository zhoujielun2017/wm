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
            title = ctx.request.body.title || '',
            content = ctx.request.body.content || '';

        var data={id:id,title:title,content:content};
         var navImg = await NavImg.findById(id);
        navImg.visit++;
        navImg.title=title;
        navImg.content=content;
        await navImg.save();

        ctx.response.body = JSON.stringify(data);
    },
    'DELETE /api/navImg': async (ctx, next) => {
         
        var id = ctx.request.body.id || '';
        var navImg = await NavImg.findById(id);
        await navImg.destroy();


        ctx.response.body = {code:"success"};
    }
};