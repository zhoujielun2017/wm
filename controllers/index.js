// index:

module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html', {
            title: 'Welcome',
            nav:"index"
        });
    },
    'GET /contact': async (ctx, next) => {
        ctx.render('contact.html', {
            title: 'Welcome'
        });
    }
};
