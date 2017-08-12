var Article=require("../model/Article");

module.exports = {
    'GET /article': async (ctx, next) => {
        var list = await Article.findAll();
        ctx.render('articles.html',{siteTitle:"技术文章",list:list});
    },
    'GET /article/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var article = await Article.findById(id);
        ctx.render('article.html',{bean:article});
    },
    'GET /manage/article': async (ctx, next) => {
        var list= await Article.findAll();
        ctx.render('./manage/article.html', {list:list});
    },
     'GET /manage/article/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var article = await Article.findById(id);
        
        // article.content=helper.html2text(article.content,false);
        ctx.render('./manage/article.html', {bean:article});
    },
    'POST /api/article': async (ctx, next) => {
         var title = ctx.request.body.title || '',
            content = ctx.request.body.content || '';


        var data={title:title,content:content};
        var article = await Article.create({
            visit:0,
            title: title,
            tag:"",
            content: content
        });

        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(data);
    },
    'PUT /api/article': async (ctx, next) => {
         
         var id = ctx.request.body.id || '',
            title = ctx.request.body.title || '',
            content = ctx.request.body.content || '';


        var data={id:id,title:title,content:content};
         var article = await Article.findById(id);
        article.visit++;
        article.title=title;
        article.content=content;
        await article.save();

        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(data);
    }
};