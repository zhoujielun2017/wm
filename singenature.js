// var request = require('request');
// var moment = require('moment');
// var crypto = require('crypto');
// // console.log(moment().format('YYYY-MM-DDTHH:mm:ss')+"Z");
// // var data={
// // 	Format:"JSON",
// // 	Version:"2015-11-23",
// // 	Signature:"Pc5WB8gokVn0xfeu%2FZV%2BiNM1dgI%3D",
// // 	SignatureMethod:"HMAC-SHA1",
// // 	SignatureNonce:"e1b44502-6d13-4433-9493-69eeb068e955",
// // 	SignatureVersion:"1.0",
// // 	AccessKeyId:"key-test",
// // 	Timestamp:moment().format('YYYY-MM-DDTHH:mm:ss')+"Z",

// // 	Action:"SingleSendMail",
// // 	AccountName:"",
// // 	ReplyToAddress:"",
// // 	AddressType:"0",
// // 	ToAddress:"to@mail.com",
// // 	Subject:"主题",
// // 	HtmlBody:"正文",
// // 	ClickTrace:"1"
// // }


const querystring = require('querystring');
const crypto = require("crypto");
function getSignatureParams(params) {
    StringToSign = "POST" + "&" + percentEncode("/") + "&" + percentEncode(uriSort(params))
    var Signture = getSignture(StringToSign);
    params.Signature = Signture;
    return params; //返回带签名的完整uri
}
function percentEncode(str) { //百分比编码 uri
    // var s = encodeURI(str);
    str=str.replace(/\%/g, "%25");
    str=str.replace(/\@/g, "%40");
    str=str.replace(/\</g, "%3C");
    str=str.replace(/\>/g, "%3E");
    str=str.replace(/\'/g, "%27");
   
    
    
    // var s=encodeURIComponent(str);
     var s = encodeURI(str);
    return s
        .replace(/ /g, "%20")
        .replace(/\//g, "%2F")
        .replace(/\+/g, "%20")
        .replace(/\*/g, "%2A")
        .replace(/\%7E/g, "~")
        .replace(/\=/g, "%3D")
        .replace(/\&/g, "%26")
        .replace(/\:/g, "%253A")
}
//return value != null?URLEncoder.encode(value, "UTF-8").replace("+", "%20").replace("*", "%2A").replace("%7E", "~"):null;

function getSignture(Signature) {  //计算HMAC
    // 47awTgVxfVEBL8hewkBgYD6kEvuJn0 
    return crypto
        .createHmac('sha1', "testsecret&") //你的secret
        .update(Signature)
        .digest()
        .toString('base64');
}
function uriSort(uri) { //uri参数排序
    var arr = querystring.stringify(uri).split("&");
    arr = arr.sort();
    var str = "";
    [].forEach.call(arr, function (s, i) {
        if (i == (arr.length - 1)) {
            str = str + s
        } else {
            str = str + s + "&"
        }
    });
    return str;
}
var str="AccessKeyId=testid&AccountName=<a%b'>&Action=SingleSendMail&AddressType=1&Format=XML&HtmlBody=4&RegionId=cn-hangzhou&ReplyToAddress=true&SignatureMethod=HMAC-SHA1&SignatureNonce=c1b2c332-4cfb-4a0f-b8cc-ebe622aa0a5c&SignatureVersion=1.0&Subject=3&TagName=2&Timestamp=2016-10-20T06:27:56Z&ToAddress=1@test.com&Version=2015-11-23";
// getSignatureParams({})
// console.log(percentEncode(str));
console.log(getSignture("POST&%2F&"+percentEncode(str)))
//%3D = %26 &
//AccessKeyId%3Dtestid%26AccountName%3D%3Ca%25b'%3E%26Action%3DSingleSendMail%26AddressType%3D1%26Format%3DXML%26HtmlBody%3D4%26RegionId%3Dcn-hangzhou%26ReplyToAddress%3Dtrue%26SignatureMethod%3DHMAC-SHA1%26SignatureNonce%3Dc1b2c332-4cfb-4a0f-b8cc-ebe622aa0a5c%26SignatureVersion%3D1.0%26Subject%3D3%26TagName%3D2%26Timestamp%3D2016-10-20T06%253A27%253A56Z%26ToAddress%3D1@test.com%26Version%3D2015-11-23

var tmp2="POST&%2F&AccessKeyId%3Dtestid&AccountName%3D%253Ca%2525b%2527%253E&Action%3DSingleSendMail&AddressType%3D1&Format%3DXML&HtmlBody%3D4&RegionId%3Dcn-hangzhou&ReplyToAddress%3Dtrue&SignatureMethod%3DHMAC-SHA1&SignatureNonce%3Dc1b2c332-4cfb-4a0f-b8cc-ebe622aa0a5c&SignatureVersion%3D1.0&Subject%3D3&TagName%3D2&Timestamp%3D2016-10-20T06%253A27%253A56Z&ToAddress%3D1%2540test.com&Version%3D2015-11-23"

//正确
var tmp4="POST&%2F&AccessKeyId%3Dtestid%26AccountName%3D%253Ca%2525b%2527%253E%26Action%3DSingleSendMail%26AddressType%3D1%26Format%3DXML%26HtmlBody%3D4%26RegionId%3Dcn-hangzhou%26ReplyToAddress%3Dtrue%26SignatureMethod%3DHMAC-SHA1%26SignatureNonce%3Dc1b2c332-4cfb-4a0f-b8cc-ebe622aa0a5c%26SignatureVersion%3D1.0%26Subject%3D3%26TagName%3D2%26Timestamp%3D2016-10-20T06%253A27%253A56Z%26ToAddress%3D1%2540test.com%26Version%3D2015-11-23"
// console.log("POST&%2F&"+percentEncode(str));