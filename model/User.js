const db = require('../db');

module.exports = db.defineModel('user', {
    role: db.BIGINT,
    name: db.STRING(100),
    //用户类型 factory
    type: db.STRING(20),
    email: db.STRING(100),
    password:db.STRING(100),
    status: db.BIGINT,
    verified: db.BIGINT,
    last_login_time:{
        type: db.BIGINT,
        allowNull: true
    },
    head_url:{
        type: db.STRING(1000),
        allowNull: true
    } 
});
