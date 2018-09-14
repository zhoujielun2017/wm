var Article=require("../model/Article"),
    NavImg=require("../model/NavImg");

module.exports = {
    'GET /': async (ctx, next) => {

        var page=ctx.request.query.page||1,
        pageSize=8;

        Article.findAndCountAll
        var articles = await Article.findAll({
            'limit': pageSize,
            'offset': pageSize*(page-1),
             order: 'create_time DESC'
        });

        var imgs = await NavImg.findAll({
            where: {
                type: "indextop"
            }
        });
        var buttomimgs = await NavImg.findAll({
            where: {
                type: "indexbuttom"
            }
        });
        ctx.render('index.html', {
            
            nav:"index",
            articles:articles,
            imgs:imgs,
            buttomimgs:buttomimgs
        });
    },
    'GET /contact': async (ctx, next) => {
        ctx.render('contact.html', {
            title: 'Welcome'
        });
    }
};
