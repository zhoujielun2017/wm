var Wiki=require("../model/Wiki"),
    Wikimenu=require("../model/Wikimenu");

module.exports = {
    'GET /wiki/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var wiki = await Wiki.findById(id);
        var menus=await Wikimenu.findAll({
            where:{
                root_id:"3ae38b8e4b224bdaad7ac41e0b1f10f6"
            }
        });
        console.log(wiki);
        ctx.render('wiki.html',{wiki:wiki,menus:menus});
    },
    'GET /manage/wiki': async (ctx, next) => {
        var list= await Wiki.findAll();
        ctx.render('./manage/wiki.html', {
            list: list
        });
    },
     'GET /manage/wiki/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var wiki = await Wiki.findById(id);

        ctx.render('./manage/wiki.html', {bean:wiki});
    },
    'POST /api/wiki': async (ctx, next) => {
         var title = ctx.request.body.title || '',
            content = ctx.request.body.content || '';

        console.log(title);
        console.log(content);
        var data={title:title,content:content};
        var wiki = await Wiki.create({
            visit:0,
            title: title,
            tag:"",
            content: content
        });
        console.log('created: ' + JSON.stringify(wiki));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(data);
    },
    'PUT /api/wiki': async (ctx, next) => {
         
         var id = ctx.request.body.id || '',
            title = ctx.request.body.title || '',
            content = ctx.request.body.content || '';

        console.log(title);
        console.log(content);
        var data={id:id,title:title,content:content};
         var wiki = await Wiki.findById(id);
        wiki.visit++;
        wiki.title=title;
        wiki.content=content;
        await wiki.save();
        console.log('updated: ' + JSON.stringify(wiki));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(data);
    },
    'GET /api/wiki/:id': async (ctx, next) => {
         
        var id = ctx.params.id || '';
        var data = await Wiki.findById(id);
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify(data);
    }
};