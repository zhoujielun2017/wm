var User=require("./model/User");
var loginUrl=["/user/center","/manage/user","/manage/users",
"/cooperation","/api/cooperation","/user/buy","/environment","/design"];
function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
}  

function loginController() {
   
    return async (ctx, next) => {
        var url=ctx.request.url;
        if(~url.indexOf("?")){
            url=url.substring(0,url.indexOf("?"))
        }
        
        if(contains(loginUrl,url)){
           var user=ctx.session.user;
            if(!user){
                console.log("未登录",url);
                ctx.response.redirect('/login/login');
                return ;
                
            }
        }
        if(~url.indexOf("manage")){
            var factoryCount = await User.count({
                where:{type:"factory"}
            });
            var sellerCount = await User.count({
                where:{type:"seller"}
            });
            var agencyCount = await User.count({
                where:{type:"agency"}
            });
            var designCount = await User.count({
                where:{type:"design"}
            });
            ctx.request.factoryCount=factoryCount;
            ctx.request.sellerCount=sellerCount;
            ctx.request.agencyCount=agencyCount;
            ctx.request.designCount=designCount;
        }
       
       
        console.log("登陆判断通过",url);
        await next();
    };
}


module.exports = loginController;
