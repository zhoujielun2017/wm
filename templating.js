const nunjucks = require('nunjucks');
const config = require('./config');
function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || true,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

function templating(path, opts) {
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        ctx.render = function (view, model) {
            var user=ctx.session.user;
            ctx.response.body = env.render(view, 
                Object.assign({}, ctx.request,ctx.state , model ,{sessionuser:user},config.web));
            ctx.response.type = 'text/html';
        };
        await next();
    };
}

module.exports = templating;
