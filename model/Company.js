const db = require('../db');

module.exports = db.defineModel('company', {
    name: db.STRING(500),
    ename: db.STRING(500),
    address: db.STRING(500),
    legal_person: db.STRING(20),
    user_id: db.STRING(32),
    phone: db.STRING(20),
    custom_service: db.STRING(100),
    email: db.STRING(100),
    content: db.STRING(1000),
    acreage:{
        type: db.STRING(20),
        allowNull: true
    },
    type_per_month:{
        type: db.STRING(20),
        allowNull: true
    },
    count_person:{
        type: db.STRING(20),
        allowNull: true
    },
    count_qc:{
        type: db.STRING(20),
        allowNull: true
    },
    able_per_month:{
        type: db.STRING(20),
        allowNull: true
    },
    major:{
        type: db.STRING(500),
        allowNull: true
    }
});
