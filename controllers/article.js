var Article=require("../model/Article");
var PageUtil=require("../util/PageUtil");

var articles=async (ctx, next) =>{
        var page=ctx.request.query.page||1;
        var result = await Article.findAndCountAll({
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1),
            order: 'create_time DESC'
        });
       

        ctx.render('./article/list.html', {
            result:result,
            page:PageUtil.getPage(page,result.count)}
        );
        
    },
    article_id=async (ctx, next) => {
        var id=ctx.params.id;
        var article = await Article.findById(id);
        ctx.render('./article/detail.html',{bean:article});
    },
    manage_article=async (ctx, next) => {
        var id=ctx.request.query.id;
        var result;
        if(id){
            result = await Article.findById(id);
        }
        ctx.render('./manage/article/add.html', {bean:result});
    },
    manage_articles=async (ctx, next) => {
        var page=ctx.request.query.page||1;
        var result = await Article.findAndCountAll({
            'limit': PageUtil.pageSize,
            'offset': PageUtil.pageSize*(page-1),
            order: 'create_time DESC'
        });
      

        ctx.render('./manage/article/list.html', {
            result:result,
            page:PageUtil.getPage(page,result.count)}
        );
    },
    manage_article_id=async (ctx, next) => {
        var id=ctx.params.id;
        var article = await Article.findById(id);
        
        // article.content=helper.html2text(article.content,false);
        ctx.render('./manage/article.html', {bean:article});
    },
    api_article=async (ctx, next) => {
         var title = ctx.request.body.title || '',
             type = ctx.request.body.type || '',
            content = ctx.request.body.content || '';

        var data={title:title,content:content};
        var article = await Article.create({
            visit:0,
            title: title,
            type:type,
            tag:"",
            content: content
        });

        ctx.body = {code:"success",id:article.id};
    },
    api_article_update=async (ctx, next) => {
         
         var id = ctx.request.body.id || '',
            title = ctx.request.body.title || '',
            type = ctx.request.body.type || '',
            content = ctx.request.body.content || '';


        var data={id:id,title:title,content:content};
         var article = await Article.findById(id);
        article.visit++;
        article.title=title;
        article.type=type;
        article.content=content;
        await article.save();

        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(data);
    },
    api_article_delete=async (ctx, next) => {
         
         var id = ctx.params.id ;
 
         await Article.destroy({
          where: {
            id:id
          }
        });

        ctx.response.body = {code:"success"};
    }

module.exports = {
    //前台列表
    'GET /articles': articles ,
    //前台详情
    'GET /article/:id': article_id,
    //后台添加
    'GET /manage/article': manage_article,
    //后台列表
    'GET /manage/articles': manage_articles,
    //后台详情
     'GET /manage/article/:id': manage_article_id,
     //添加接口
    'POST /api/article': api_article,
    //更新接口
    'PUT /api/article': api_article_update,
    'DELETE /api/article/:id': api_article_delete
};

