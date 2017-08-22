const fs = require('fs');
const path = require('path');
const os = require('os');
const db = require('../db');
const koaBody  = require('koa-body');

//递归创建目录 同步方法  
function mkdirsSync(dirname) {  
    //console.log(dirname);  
    if (fs.existsSync(dirname)) {  
        return true;  
    } else {  
        if (mkdirsSync(path.dirname(dirname))) {  
            fs.mkdirSync(dirname);  
            return true;  
        }  
    }  
}  

// app.use(koaBody({ multipart: true }));

module.exports = {

    //详见http://docs.ckeditor.com/#!/guide/dev_file_upload
    'POST /file': async (ctx, next) => {
       
        const file = ctx.request.body.files.upload;
        const reader = fs.createReadStream(file.path);
        var now=new Date();
        var dfdir="/data/img";
        
         var webdir=path.posix.join("/img/",now.getFullYear().toString(),(now.getMonth()+1)+""+now.getDate());
        var url=path.posix.join(webdir,db.generateId()+".jpg");
        console.log(url);
        console.log("file url:"+url);
        mkdirsSync(path.join(dfdir,webdir));
        console.log("file dfdir+url:"+dfdir+url);
        const stream = fs.createWriteStream(path.join(dfdir,url),{  
            flags: 'a',  
            encoding: null,  
            mode: 0777     
            });

        reader.pipe(stream);
        console.log('uploading %s -> %s', file.name, stream.path);
        
        var type=ctx.request.query.type;
        var CKEditorFuncNum=ctx.request.query.CKEditorFuncNum;
        console.log("type1"+type);
        console.log("CKEditorFuncNum1"+CKEditorFuncNum);
        var domain="http://localhost";
        if(process.env.NODE_ENV == 'production'){
            domain="upload.js";
        }
        var encoding=encodeURI(domain+url.replace("\\","/"));
        if("Images"==type){
            ctx.response.type = 'text/html';
            ctx.response.body='<script type="text/javascript">'+
            'window.parent.CKEDITOR.tools.callFunction("'+CKEditorFuncNum+'", "http://localhost'+url+'", "'+encoding+'");</script>';
            return;
        }else{
            ctx.response.type = 'application/json';
            ctx.response.body = JSON.stringify({
                "uploaded": 1,
                "fileName": file.name,
                "url": domain+url
            });
        }
        
    }
};