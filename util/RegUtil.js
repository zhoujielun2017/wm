var RegUtil={
};

// 替换邮箱字符
function replaceEmail(email_address) {
    　
    var regex = /([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)/g;
    alert_string=email_address.replace(regex,'******');
    return alert_string;
}
     
// 替换手机字符
function replaceMobile(str) {
　　str=str.replace(/1[[0-9]{10}/g,'******');
    return str;
}　
    
    

RegUtil.replaceEmail=replaceEmail;
RegUtil.replaceMobile=replaceMobile;
module.exports = RegUtil;