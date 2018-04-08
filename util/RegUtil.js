var RegUtil={
};

// 替换邮箱字符
function replaceEmail(email_address) {
    if(!email_address){
        return "";
    }
    var regex = /([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)/g;
    var regex2 = /([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)/g;
    alert_string=email_address.replace(regex,'******').replace(regex2,'******');
    return alert_string;
}
     
// 替换手机字符
function replaceMobile(str) {
    if(!str){
        return "";
    }
　　str=str.replace(/1[[0-9]{10}/g,'******').replace(/[1-9][[0-9]{6,7}/g,'******');
    return str;
}　
    
    

RegUtil.replaceEmail=replaceEmail;
RegUtil.replaceMobile=replaceMobile;
module.exports = RegUtil;