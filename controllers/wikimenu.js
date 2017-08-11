var Wikimenu=require("../model/Wikimenu");
var Wiki=require("../model/Wiki");
var db=require("../db");

module.exports = {
    'GET /wikimenu/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var wikimenu = await Wikimenu.findById(id);
        console.log(wikimenu);
        ctx.render('wikimenu.html',wikimenu);
    },
    'GET /manage/wikimenu': async (ctx, next) => {
        var roots = await Wikimenu.findAll({ where: {
            parent_id: null
        }});
        var wikis = await Wiki.findAll();
        ctx.render('./manage/wikimenu.html', {roots:roots,wikis:wikis});
    },
     'GET /manage/Wikimenu/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var Wikimenu = await Wikimenu.findById(id);
        console.log('find: ' + JSON.stringify(Wikimenu));
        // Wikimenu.content=helper.html2text(Wikimenu.content,false);
        ctx.render('./manage/Wikimenu.html', {id:Wikimenu.id,title:Wikimenu.title,content:Wikimenu.content});
    },
    'POST /api/wikimenus': async (ctx, next) => {
         var name = ctx.request.body.name || '',
            sort = ctx.request.body.sort||1 ,
            parent_id = ctx.request.body.parent_id||null,
            root_id = ctx.request.body.root_id || 1,
            wiki_id = ctx.request.body.wiki_id || 1;

        var wikimenu = await Wikimenu.create({
            parent_id:parent_id,
            root_id:root_id,
            wiki_id:wiki_id,
            name: name,
            sort:sort
        });
        
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({code:"success"});
    },
    'PUT /api/wikimenus': async (ctx, next) => {
         
         var id = ctx.request.body.id || '',
            name = ctx.request.body.name || '',
            sort = ctx.request.body.sort || 1,
            parent_id = ctx.request.body.parent_id||null,
            root_id = ctx.request.body.root_id || 1,
            wiki_id = ctx.request.body.wiki_id || 1;


        var wikimenu = await Wikimenu.findById(id);
        wikimenu.visit++;
        wikimenu.name=name;
        wikimenu.wiki_id=wiki_id;
        wikimenu.parent_id=parent_id;
        wikimenu.sort=sort;
        await wikimenu.save();
        console.log('updated: ' + JSON.stringify(wikimenu));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({"code":"success"});
    },
    'GET /api/wikimenus': async (ctx, next) => {
         
        var root_id = ctx.request.query.root_id || '';
        var menus = await Wikimenu.findAll({
             where:{
                 root_id:root_id
             }
        });
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(menus);
    },
    'GET /api/wikimenus/:id': async (ctx, next) => {
         
        var id = ctx.params.id || '';
        var menu = await Wikimenu.findById(id);
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(menu);
    }
};