
//不开放的栏目
var desing_notallow_urls=["/sellers","/agencys","/factorys","/search/seller","/search/agency","/search/factory"];
//供应商不能看供应商
var factory_notallow_urls=["/factorys","/search/factory"];

function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
}  

function roleController() {
   
    return async (ctx, next) => {
        console.log(`Role process ${ctx.request.method} ${ctx.request.url}...`);
        var url=ctx.request.url;
        if(~url.indexOf("?")){
            url=url.substring(0,url.indexOf("?"))
        }
        var user=ctx.session.user;
        var notAllow=false;
        //游客
        if(!user){
            if(contains(desing_notallow_urls,url)){
                notAllow=true;
            }
            if(contains(factory_notallow_urls,url)){
                notAllow=true;
            }
        }else{
            //设计师,普通用户或者高级用户
            if(user.role<=1&&user.type&&user.type=='design'){
                if(contains(desing_notallow_urls,url)){
                    notAllow=true;
                }
            }
            if(user.role<=1&&user.type&&user.type=='factory'){
                if(contains(factory_notallow_urls,url)){
                    notAllow=true;
                }
            }
        }
        
        if(notAllow){
            ctx.render('403.html', {});
        }else{
            await next();
        }
        

        // var start = new Date().getTime(),
        //     execTime;
        // await next();
        // execTime = new Date().getTime() - start;
        // ctx.response.set('X-Response-Time', `${execTime}ms`);
    };
}


module.exports = roleController;
