const Koa = require('koa'),
    session = require('koa-session'),
    bodyParser = require('koa-bodyparser'),
    koastatic = require('koa-static-cache'),
    moment = require('moment'),
    controller = require('./controller'),
    locale = require('koa-locale'),
    i18n = require('koa-i18n'),
    templating = require('./templating'),
    loginController = require('./loginController'),
     roleController = require('./role'),
    favicon = require('koa-favicon'),
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
  maxAge: 86400000*30,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};

app.use(session(CONFIG, app));
app.use(favicon(__dirname + '/favicon.ico'));
//i18n
app.use(i18n(app, {
  directory: './i18n',
  locales: [ 'en','zh-CN'], //  `zh-CN` defualtLocale, must match the locales to the filenames
  defaultLocale: 'en',
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

// static file support:
// app.use(staticFiles('/static/', __dirname + '/static'));
// app.use(koastatic('./static', {maxAge: 60 * 60* 24 * 7}));

app.use(koastatic('./static', {maxAge: 0,buffer:false,dynamic:true}));
// parse request body:
app.use(bodyParser());

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
       },
       //数字千分位
       fmoney:function(s, n){   
          if(isNaN(s)){
            return s;
          }
          // console.log("111111111111"+s,n);
          n = (n >= 0 && n <=20)? n : 2;   
          s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
          var l = s.split(".")[0].split("").reverse(),   
          r = s.split(".")[1];   
          t = "";   
          for(i = 0; i < l.length; i ++ ){   
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
          }
          if(r){
            return t.split("").reverse().join("") + "." + r;   
          }else{
            return t.split("").reverse().join("");   
          }
      }
    }
}));
//登录控制
app.use(loginController());
//角色控制
app.use(roleController());
// add controller:
app.use(controller());

app.listen(8080);

console.log('app started at port 8080...');
