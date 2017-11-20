
var loginUrl=["/user/center","/manage/user","/manage/users","/cooperation","/api/cooperation"];
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
        console.log("登陆判断",url);
        if(contains(loginUrl,url)){
           var user=ctx.session.user;
            if(!user){
                console.log("未登录",url);
                ctx.response.redirect('/login/login');
                return ;
                
            }
        
        }
        await next();
    };
}


module.exports = loginController;
