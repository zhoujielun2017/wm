var Nav=require("../model/Nav");

module.exports = {
    'GET /nav/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var nav = await Nav.findById(id);
        console.log(nav);
        
        ctx.render('nav.html',{content:nav.content});
    },
    'GET /manage/nav': async (ctx, next) => {
        var navs = await Nav.findAll();
        var model={
            navs:navs
        }
        ctx.render('./manage/nav.html', model);
    },
     'GET /manage/nav/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var nav = await Nav.findById(id);
        console.log('find: ' + JSON.stringify(nav));
        // nav.content=helper.html2text(nav.content,false);
        ctx.render('./manage/nav.html', {id:nav.id,title:nav.title,content:nav.content});
    },
    'POST /api/nav': async (ctx, next) => {
         var name = ctx.request.body.name || '',
            url = ctx.request.body.url || '';
        var nav = await Nav.create({
            name: name,
            sort:1,
            url: url
        });
        console.log('created: ' + JSON.stringify(nav));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({code:"success"});
    },
    'PUT /api/nav': async (ctx, next) => {
         
         var id = ctx.request.body.id || '',
            title = ctx.request.body.title || '',
            content = ctx.request.body.content || '';

        console.log(title);
        console.log(content);
        var data={id:id,title:title,content:content};
         var nav = await Nav.findById(id);
        nav.visit++;
        nav.title=title;
        nav.content=content;
        await nav.save();
        console.log('updated: ' + JSON.stringify(nav));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(data);
    },
    'DELETE /api/nav': async (ctx, next) => {
         
        var id = ctx.request.body.id || '';
        var nav = await Nav.findById(id);
        await nav.destroy();
        console.log('destory: ' + JSON.stringify(nav));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({code:"success"});
    }
};