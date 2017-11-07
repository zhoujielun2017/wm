const Koa = require('koa'),
    session = require('koa-session'),
    bodyParser = require('koa-bodyparser'),
    koastatic = require('koa-static-cache'),
    moment = require('moment'),
    controller = require('./controller'),
    locale = require('koa-locale'),
    i18n = require('koa-i18n'),
    templating = require('./templating'),
    staticFiles = require('./static-files');

const app = new Koa();
locale(app)

const isProduction = process.env.NODE_ENV === 'production';

//session
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

//i18n
app.use(i18n(app, {
  directory: './i18n',
  locales: [ 'en','zh-CN'], //  `zh-CN` defualtLocale, must match the locales to the filenames
  modes: [
    'query',                //  optional detect querystring - `/?locale=en-US`
    'subdomain',            //  optional detect subdomain   - `zh-CN.koajs.com`
    'cookie',               //  optional detect cookie      - `Cookie: locale=zh-CH`
    'header',               //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
    'url',                  //  optional detect url         - `/en`
    'tld',                  //  optional detect tld(the last domain) - `koajs.cn`
    function() {}           //  optional custom function (will be bound to the koa context)
  ]
}))

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

var loginUrl=["manage","/user/center"];
var roleUrl=["/sellers","/agencys","/factorys","/designs","/search",""];
var loginUrls=loginUrl.concat(roleUrl);
var roleurls=roleUrl.join(",");
var loginStr=loginUrls.join(",")

//后台登陆
app.use(async (ctx, next) => {
    var url=ctx.request.url;
   
   
    if(~loginStr.indexOf(url+",")){
      var user=ctx.session.user;
      if(!user){
          console.log("未登录",url);
          ctx.response.redirect('/login/login');
          return ;
        
      }
     
    }
     await next();
});


//购买会员
app.use(async (ctx, next) => {
    var url=ctx.request.url;
    var user=ctx.session.user;
    if(~url.indexOf(".js")||~url.indexOf(".png")||~url.indexOf(".jpg")||~url.indexOf(".css")){
      await next();
      return ;
    }
    if(user){
      console.log("角色判断",url,user);
      
      if(~roleurls.indexOf(url+",")){

      //非管理员,普通会员
        var vipOrAdmin=user.verified||user.role==8||user.role==9;
        console.log("角色",vipOrAdmin);
        if(!vipOrAdmin){
          console.log("跳转购买也",vipOrAdmin);
          ctx.response.redirect('/user/buy');
          return ;
        }
          
      }
    }
    await next();
});

// static file support:
// app.use(staticFiles('/static/', __dirname + '/static'));
// app.use(koastatic('./static', {maxAge: 60 * 60* 24 * 7}));

app.use(koastatic('./static', {maxAge: 0,buffer:false,dynamic:true}));
// parse request body:
app.use(bodyParser());

// app.use(koaBody({ multipart: true }));

// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction,
    autoescape:false,
    filters: {
        formatdate: function(str, format, meridiem) {
            
           if (str !== undefined&&str) {
             if (!meridiem) {
               return moment(+str).format(format);
             }
             else {
               return moment(+str).format(format).replace(/(a{1,2}|p)\.?m{1}?\.?/i, "$1.m.");
             }
           }
       }
    }
}));

// add controller:
app.use(controller());



app.listen(8080);

console.log('app started at port 8080...');
