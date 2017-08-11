// index:

module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html', {
            title: 'Welcome'
        });
    },
    'GET /editor': async (ctx, next) => {
        ctx.render('editor.html', {
            title: 'Welcome'
        });
    }
};
