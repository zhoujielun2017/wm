var Article=require("../model/Article");

module.exports = {
    'GET /': async (ctx, next) => {

        var page=ctx.request.query.page||1,
        pageSize=5;

        Article.findAndCountAll
        var articles = await Article.findAll({
            'limit': pageSize,
            'offset': pageSize*(page-1),
             order: 'create_time DESC'
        });

        //console.log(articles);

        ctx.render('index.html', {
            
            nav:"index",
            articles:articles
        });
    },
    'GET /contact': async (ctx, next) => {
        ctx.render('contact.html', {
            title: 'Welcome'
        });
    }
};
