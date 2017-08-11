const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

function staticFiles(url, dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            if (await fs.exists(fp)) {
                ctx.response.type = mime.lookup(rpath);
                ctx.response.body = await fs.readFile(fp);
                
                ctx.response.setHeader("cache-control:max-age=691200");
                // ctx.response.header="cache-control:max-age=691200";
                // expires:Sat, 15 Jul 2017 20:12:18 GMT
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    };
}

module.exports = staticFiles;
