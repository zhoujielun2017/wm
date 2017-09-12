const db = require('../db');

module.exports = db.defineModel('design', {
    name: db.STRING(500),
    gender:{
        type: db.STRING(10),
        allowNull: true
    },
    age:{
        type: db.STRING(10),
        allowNull: true
    },
    user_id: {
        type: db.STRING(32),
        allowNull: true
    },
    status:{
        type: db.STRING(10),
        allowNull: true
    },
    content: db.STRING(1000),
    //特长
    major:{
        type: db.STRING(500),
        allowNull: true
    },
    //工作经历
    work_experience:{
        type: db.STRING(1000),
        allowNull: true
    },
    //所在地
    area:{
        type: db.STRING(100),
        allowNull: true
    }
});
