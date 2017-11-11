const db = require('../db');

module.exports = db.defineModel('factory', {
    name: db.STRING(500),
    ename: db.STRING(500),
    address: db.STRING(500),
    legal_person: db.STRING(20),
    user_id: db.STRING(32),
    phone: db.STRING(20),
    custom_service: db.STRING(100),
    email: db.STRING(100),
    content: db.STRING(1000),
    //面积
    acreage:{
        type: db.STRING(20),
        allowNull: true
    },
    type_per_month:{
        type: db.STRING(20),
        allowNull: true
    },
    //生产人数
    count_person:{
        type: db.STRING(20),
        allowNull: true
    },
    //qc数量
    count_qc:{
        type: db.STRING(20),
        allowNull: true
    },
    //月产量
    able_per_month:{
        type: db.STRING(20),
        allowNull: true
    },
    //特长
    major:{
        type: db.STRING(500),
        allowNull: true
    },
    //所在地
    area:{
        type: db.STRING(100),
        allowNull: true
    },
     build_time:{
        type: db.BIGINT,
        allowNull: true
    }
});
