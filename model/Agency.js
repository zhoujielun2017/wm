const db = require('../db');

module.exports = db.defineModel('agency', {
    name: db.STRING(500),
    ename: db.STRING(500),
    address: db.STRING(500),
    user_id: db.STRING(32),
    phone: db.STRING(20),
    company_phone: db.STRING(20),
    custom_service: db.STRING(100),
    email: db.STRING(100),
    offical_website:{
        type: db.STRING(200),
        allowNull: true
    },
    china:{
        type: db.STRING(2),
        allowNull: true
    },
    china_office:{
        type: db.STRING(200),
        allowNull: true
    },
    //联系人职位
    position:{
        type: db.STRING(30),
        allowNull: true
    },
    //合作品牌
    brand:{
        type: db.STRING(1000),
        allowNull: true
    },
    //年采购额
    purchase_per_year:{
        type: db.STRING(20),
        allowNull: true
    },
    //账期
    payment_days:{
         type: db.STRING(20),
        allowNull: true
    },
    area:{
         type: db.STRING(100),
        allowNull: true
    },
    twitter:{
          type: db.STRING(100),
        allowNull: true
    },
    facebook:{
          type: db.STRING(100),
        allowNull: true
    },
     build_time:{
        type: db.BIGINT,
        allowNull: true
    }
});
