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

        var imgs = await NavImg.findAll();
        ctx.render('index.html', {
            
            nav:"index",
            articles:articles,
            imgs:imgs
        });
    },
    'GET /contact': async (ctx, next) => {
        ctx.render('contact.html', {
            title: 'Welcome'
        });
    }
};
