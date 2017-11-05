const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    db = require('../db'),
    UpYun = require("node-for-upyun");


    var upyun = new UpYun('lwj','lwj201314','acclist-pic');

    // koaBody  = require('koa-body');
    
    // const upyun = require('../index');
    
    // const Service=require('../upyun/service');
// var sign = require("../lib/sign");
// var Upyun = require("../lib/upyun");
// const bucket = new Service('acclist-pic', 'lwj', 'lwj201314');
// var upyun = new Upyun('acclist-pic', 'lwj', 'lwj201314');



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
    // 'POST /file': async (ctx, next) => {
       
    //     const file = ctx.request.body.files.upload;
    //     const reader = fs.createReadStream(file.path);
    //     var now=new Date();
    //     var dfdir="/data/img";
        
    //      var webdir=path.posix.join("/img/",now.getFullYear().toString(),(now.getMonth()+1)+""+now.getDate());
    //     var url=path.posix.join(webdir,db.generateId()+".jpg");
    //     console.log(url);
    //     console.log("file url:"+url);
    //     mkdirsSync(path.join(dfdir,webdir));
    //     console.log("file dfdir+url:"+dfdir+url);
    //     const stream = fs.createWriteStream(path.join(dfdir,url),{  
    //         flags: 'a',  
    //         encoding: null,  
    //         mode: 0777     
    //         });

    //     reader.pipe(stream);
    //     console.log('uploading %s -> %s', file.name, stream.path);
        
    //     var type=ctx.request.query.type;
    //     var CKEditorFuncNum=ctx.request.query.CKEditorFuncNum;
    //     console.log("type1"+type);
    //     console.log("CKEditorFuncNum1"+CKEditorFuncNum);
    //     var domain="http://localhost";
    //     if(process.env.NODE_ENV == 'production'){
    //         domain="upload.js";
    //     }
    //     var encoding=encodeURI(domain+url.replace("\\","/"));
    //     if("Images"==type){
    //         ctx.response.type = 'text/html';
    //         ctx.response.body='<script type="text/javascript">'+
    //         'window.parent.CKEDITOR.tools.callFunction("'+CKEditorFuncNum+'", "http://localhost'+url+'", "'+encoding+'");</script>';
    //         return;
    //     }else{
    //         ctx.response.type = 'application/json';
    //         ctx.response.body = JSON.stringify({
    //             "uploaded": 1,
    //             "fileName": file.name,
    //             "url": domain+url,
    //             "path":url
    //         });
    //     }
        
    // },
    'POST /file': async (ctx, next) => {
       
        const file = ctx.request.body.files.upload;
        const reader = fs.createReadStream(file.path);
        var now=new Date();
        var dfdir="/data/img";
        // console.log('uploading %s -> %s', file.name, stream.path);
        
        var type=ctx.request.query.type;
        var CKEditorFuncNum=ctx.request.query.CKEditorFuncNum;
        // console.log("type1",type);
        // console.log("CKEditorFuncNum1",CKEditorFuncNum);
        var domain="http://localhost";
        if(process.env.NODE_ENV == 'production'){
            domain="upload.js";
        }
         var domain="acclist-pic.b0.upaiyun.com";
       

        var webdir=path.posix.join("/img/",now.getFullYear().toString(),(now.getMonth()+1)+""+now.getDate());
        var url=path.posix.join(webdir,db.generateId()+".jpg");
        
        // var storePath=path.join(dfdir,url);
        // console.log("http://"+domain+url)
        // console.log("storePath",storePath.replace("\\","/"))
        // const stream = fs.createWriteStream(storePath,{  
        //     flags: 'a',  
        //     encoding: null,  
        //     mode: 0777     
        //     });
        var encoding=encodeURI(domain+url.replace("\\","/"));
        console.log("encoding",encoding);
        var content=new Buffer(0);//累计合并读取片段  
        // var reader = fs.createReadStream(fpath, {start: 0, end: 262});
        reader.on('data', function(chunk) {
            // console.log(chunk.toString());//这是结果
          content=Buffer.concat([content,chunk]);  
        //    data+=chunk;
        });
        reader.on('end', function() {
             console.log("end");
            // const data = Buffer.from(buffers);
            // console.log('isBuffer: ' + Buffer.isBuffer(data))
            // console.log("end");
            var imgData=new Buffer(content,'base64'); 
             upyun.uploadImageFromStream(imgData,url,function(err,resHeaders,resData){
                console.log(err);
                // ctx.response.type = 'text/html';
                // ctx.response.body='<script type="text/javascript">'+
                // 'window.parent.CKEDITOR.tools.callFunction("'+CKEditorFuncNum+'", "http://'+domain+url+'", "'+encoding+'");</script>';
                // return;
            });
        });
        // reader.pipe(stream);

        
      
       
       
        // upyun.upload(reader, url, { md5: true }, function(err, result) {
        //     if(err) {
        //         return console.log(err.message);
        //     }

        //     ctx.response.type = 'text/html';
        //     ctx.response.body='<script type="text/javascript">'+
        //     'window.parent.CKEDITOR.tools.callFunction("'+CKEditorFuncNum+'", "http://localhost'+url+'", "'+encoding+'");</script>';
        //     return;
        // });


        if("Images"==type){
            ctx.response.type = 'text/html';
            ctx.response.body='<script type="text/javascript">'+
            'window.parent.CKEDITOR.tools.callFunction("'+CKEditorFuncNum+'", "http://'+domain+url+'", "'+encoding+'");</script>';
            return;
        }else{
            ctx.response.type = 'application/json';
            ctx.response.body = JSON.stringify({
                "uploaded": 1,
                "fileName": file.name,
                "url": domain+url,
                "path":url
            });
        }
        
    },
    'POST /file/upyun': async (ctx, next) => {
       
        const file = ctx.request.body.files.upload;
        console.log(file);
        var reader=new Buffer(file)
        var now=new Date();
        var dfdir="/data/img";
        
        var webdir=path.posix.join("/img/",now.getFullYear().toString(),(now.getMonth()+1)+""+now.getDate());
        var url=path.posix.join(webdir,db.generateId()+".jpg");
        console.log(url);
        var domain="acclist-pic.b0.upaiyun.com";
        upyun.upload(reader, url, { md5: true }, function(err, result) {
            if(err) {
                return console.log(err.message);
            }

            ctx.response.body = JSON.stringify({
                "uploaded": 1,
                "domain":domain,
                "path":url
            });
        });
        
    },
    'GET /sign': async (ctx, next) => {


        var query=ctx.query;
        // console.log(upyun);
        // var now=new Date();
        // var webdir=path.posix.join("/img/",now.getFullYear().toString(),(now.getMonth()+1)+""+now.getDate());
        // var url=path.posix.join(webdir,db.generateId()+".jpg");
        // console.log("url",url);
        const headSign = upyun.sign.getHeaderSign(bucket, query.method, query.path);
        // const headSign = sign.getHeaderSign("acclist-pic", query.method, query.path)
        console.log(headSign);
       ctx.body=headSign;


    }
    
};