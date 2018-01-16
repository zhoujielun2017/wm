//需要角色判断的url
var role_urls=["/sellers","/agencys","/factorys","/designs","/search/seller","/search/agency",
"/search/factory",/\/seller\/.*/,/\/factory\/.*/,/\/agency\/.*/,/\/design\/.*/];

// var patt = /\/seller\/*/;
// var re=patt.test("/seller/5443dcfd3df7450cab2670f6affec227"); 
//普通会员可以看见
var visitor=[];
//设计师可以看见
var design=["/designs"];
//高级设计师可以看见
var design_vip=["/designs"];
//零售商可见
var seller=["/sellers","/agencys","/factorys","/designs","/search/seller","/search/agency",
"/search/factory"];
//高级零售商可见,零售商和中间商可以互看
var seller_vip=role_urls;
//中间商可见
var agency=["/sellers","/agencys","/factorys","/designs","/search/seller","/search/agency",
"/search/factory"];
//高级中间商可见
var agency_vip=role_urls;
//供应商可见
var factory=["/sellers","/agencys","/factorys","/designs","/search/seller","/search/agency",
"/search/factory"];
//高级供应商可见
var factory_vip=["/sellers","/agencys","/designs","/search/seller","/search/agency",/\/factory\/*/];

/**
 * 
 * @param {*} arr 对比数组
 * @param {*} obj 目标对象
 */
function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        var str=arr[i];
        if (typeof str=='string'&&str === obj) {  
            return true;  
        }  
        //正则表达式
        if (typeof str=='object'&&str.test(obj)) {  
            return true;  
        }  
    }  
    return false;  
}  

/**
 * 正则表达式判断 数组是否包含 该对象
 * @param {*} arr 
 * @param {*} obj 
 */
function patternContains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i].test(obj)) {  
            return true;  
        }  
    }  
    return false;  
}  

function getRoleUrls(user) {  
    var type = user.type;
    var role = user.role*1;
    if(type=='design'&&role==0){
        return design;
    }
    if(type=='design'&&role==1){
        return design_vip;
    }
    if(type=='seller'&&role==0){
        return seller;
    }
    if(type=='seller'&&role==1){
        return seller_vip;
    }
    if(type=='agency'&&role==0){
        return agency;
    }
    if(type=='agency'&&role==1){
        return agency_vip;
    }
    if(type=='factory'&&role==0){
        return factory;
    }
    if(type=='factory'&&role==1){
        return factory_vip;
    }
    //管理员
    if(role==8||role==9){
        return role_urls;
    }
    return [];  
}  

function roleController() {
   
    return async (ctx, next) => {
        
        var url=ctx.request.url;
        //去掉问号后面的参数
        if(~url.indexOf("?")){
            url=url.substring(0,url.indexOf("?"))
        }
        var user=ctx.session.user;
        var allow=false;
        //不包含需要角色判断的url,返回
        if(!contains(role_urls,url)){
            await next();
            return ;
        }
        console.log(`Role process ${ctx.request.method} ${ctx.request.url}...`);
        //游客
        if(!user){
            if(contains(visitor,url)){
                allow=true;
            }
        }else{
            //根据不同的用户获取可以进入的url
            var allowUrls=getRoleUrls(user);
             //seller agency facoty 普通会员
            if(contains(allowUrls,url)){
                allow=true;
            }           
        }
        
        if(!allow){
            ctx.render('403.html', {});
        }else{
            await next();
        }
        

    };
}


module.exports = roleController;
