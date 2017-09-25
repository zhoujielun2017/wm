'use strict';
const nodemailer = require('nodemailer');

//企业云邮箱各个服务器地址及端口信息如下：

// 收件服务器地址：

// POP 服务器地址：pop3.mxhichina.com 端口110，SSL 加密端口995

// 或

// IMAP 服务器地址：imap.mxhichina.com 端口143，SSL 加密端口993

// 发件服务器地址：

// SMTP 服务器地址：smtp.mxhichina.com 端口25， SSL 加密端口465
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.mxhichina.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'service@acclist.com',
        pass: 'Admin999'
    }
});





module.exports ={
    send:function(mailOptions){
        // setup email data with unicode symbols
        // let mailOptions = {
        //     from: '"service@acclist" <service@acclist.com>', // sender address
        //     to: 'zhoujielun_2016@163.com', // list of receivers
        //     subject: 'Hello ✔', // Subject line
        //     text: 'Hello world ?', // plain text body
        //     html: '<b>Hello world ?</b>' // html body
        // };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
}