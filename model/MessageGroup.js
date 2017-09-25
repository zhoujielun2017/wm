const db = require('../db');

module.exports = db.defineModel('message_group', {
    user_id: db.STRING(32),
    another_id: db.STRING(32),
    status: db.INTEGER,
    content: db.STRING(1000),
    name:db.STRING(255),
    img:{
        type: db.STRING(512),
        allowNull: true
    },
    count: db.INTEGER
});

