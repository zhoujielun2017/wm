const Koa = require('koa');

const session = require('koa-session');

const bodyParser = require('koa-bodyparser');

const koastatic = require('koa-static-cache');
const controller = require('./controller');

const templating = require('./templating');

let staticFiles = require('./static-files');

const app = new Koa();

const isProduction = process.env.NODE_ENV === 'production';

app.keys = ['some aaa hurr'];

const CONFIG = {
  key: 'sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};

app.use(session(CONFIG, app));

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
