var config = {
    dialect: 'postgres',
    database: 'wm',
    username: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    
    web:{
    	domain:"www.acclist.com",
        paydomain:"pay.acclist.com",
         img_domain:"http://acclist-pic.b0.upaiyun.com",
        js_version:1
    }
};

module.exports = config;
