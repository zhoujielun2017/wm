const db = require('../db');

module.exports = db.defineModel('factory', {
    name: db.STRING(500),
    ename: db.STRING(500),

   
    city: db.STRING(100),
    nation: db.STRING(100),
    address: db.STRING(500),
    en_address: db.STRING(500),
    en_city: db.STRING(100),
    en_nation: db.STRING(100),

    legal_person: db.STRING(20),
    user_id: db.STRING(32),
    phone: db.STRING(20),
    cellphone: db.STRING(20),
    //客服
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
    //开发部人数
    count_dev:{
        type: db.STRING(20),
        allowNull: true
    },
    //贸易部人数
    count_trade:{
        type: db.STRING(20),
        allowNull: true
    },
    //月产量
    able_per_month:{
        type: db.STRING(20),
        allowNull: true
    },
     //年销售额
     sale_per_year:{
        type: db.STRING(20),
        allowNull: true
    },
    //特长
    major:{
        type: db.STRING(500),
        allowNull: true
    },
    //产品
    product:{
        type: db.STRING(500),
        allowNull: true
    },
    //销售主管
    sale_manager:{
        type: db.STRING(64),
        allowNull: true
    },
     //销售主管
     sale_manager_email:{
        type: db.STRING(64),
        allowNull: true
    },
    sale_manager_phone:{
        type: db.STRING(20),
        allowNull: true
    },
    //所在地
    area:{
        type: db.STRING(100),
        allowNull: true
    },
    //所在地
    search:{
        type: db.STRING(1000),
        allowNull: true
    },
     build_time:{
        type: db.BIGINT,
        allowNull: true
    }
});
