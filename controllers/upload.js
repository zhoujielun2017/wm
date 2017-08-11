const fs = require('fs');
const path = require('path');
const os = require('os');
const db = require('../db');


/**
 * 同步创建多级目录
 * @param [in] dirpath 要创建的目录,支持多层级创建
 */
function mkdirsSync (dirpath, mode) { 
    try
    {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(/[/\\]/).forEach(function (dirname) {  //这里指用/ 或\ 都可以分隔目录  如  linux的/usr/local/services   和windows的 d:\temp\aaaa
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if ("\."!=pathtmp&&!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true; 
    }catch(e)
    {
        log.error("create director fail! path=" + dirpath +" errorMsg:" + e);        
        return false;
    }
}

module.exports = {

    //详见http://docs.ckeditor.com/#!/guide/dev_file_upload
    'POST /img': async (ctx, next) => {
        const file = ctx.request.body.files.upload;
        const reader = fs.createReadStream(file.path);
        var now=new Date();
        var dir="./static/img/"+now.getFullYear()+"/"+(now.getMonth()+1)+now.getDate();
        console.log(dir);
        mkdirsSync(dir)
        const stream = fs.createWriteStream(dir, db.generateId()+".jpg");
        reader.pipe(stream);
        console.log('uploading %s -> %s', file.name, stream.path);
       
        ctx.response.type = 'application/json';
        ctx.response.body = JSON.stringify({
            "uploaded": 1,
            "fileName": file.name,
            "url": stream.path
        });

    }
};