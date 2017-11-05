var Setting=require("../model/Setting");

module.exports = {
    
    'GET /manage/setting': async (ctx, next) => {
        var list = await Setting.findAll();
      
        ctx.render('./manage/setting/list.html', {list});
    },
     'GET /manage/setting/:id': async (ctx, next) => {
        var id=ctx.params.id;
        var setting = await Setting.findById(id);
        console.log('find: ' + JSON.stringify(setting));
        // setting.content=helper.html2text(setting.content,false);
        ctx.render('./manage/setting/edit.html', {bean:setting});
    },
    'POST /api/setting': async (ctx, next) => {
         var name = ctx.request.body.name || '',
            url = ctx.request.body.url || '';
        var setting = await Setting.create({
            name: name,
            sort:1,
            url: url
        });
        console.log('created: ' + JSON.stringify(setting));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({code:"success"});
    },
    'PUT /api/setting/:id': async (ctx, next) => {
         var id=ctx.params.id;
         var name = ctx.request.body.name || '',
            value = ctx.request.body.value || '';

        var data={id:id,name:name,value:value};
         var setting = await Setting.findById(id);
        setting.name=name;
        setting.value=value;
        await setting.save();
        ctx.response.body = {code:"success"};
    },
    'DELETE /api/setting/:id': async (ctx, next) => {
         
         var id=ctx.params.id;
        var setting = await Setting.findById(id);
        await setting.destroy();
        console.log('destory: ' + JSON.stringify(setting));
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({code:"success"});
    }
};