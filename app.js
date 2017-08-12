const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const koastatic = require('koa-static-cache');
const controller = require('./controller');

const templating = require('./templating');

let staticFiles = require('./static-files');

const app = new Koa();

const isProduction = process.env.NODE_ENV === 'production';

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// static file support:
// app.use(staticFiles('/static/', __dirname + '/static'));
// app.use(koastatic('./static', {maxAge: 60 * 60* 24 * 7}));
app.use(koastatic('./static', {maxAge: 10}));
// parse request body:
app.use(bodyParser());

// app.use(koaBody({ multipart: true }));

// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction,
    autoescape:false
}));

// add controller:
app.use(controller());



app.listen(8080);
console.log('app started at port 8080...');
