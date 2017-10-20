var config = {
    dialect: 'postgres',
    database: 'wm',
    username: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    img_domain:"http://acclist-pic.b0.upaiyun.com",
    web:{
    	domain:"www.acclist.com",
        paydomain:"pay.acclist.com"
    }
};

module.exports = config;
