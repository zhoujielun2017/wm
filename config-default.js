var config = {
    dialect: 'mysql',
    database: 'es',
    username: 'root',
    password: '123456',
    host: 'localhost',
    port: 3306,
    debug:true,
    web:{
    	domain:"www.acclist.com",
        paydomain:"pay.acclist.com",
         img_domain:"http://acclist-pic.b0.upaiyun.com",
        js_version:1
    }
};

module.exports = config;
