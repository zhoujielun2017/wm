const db = require('../db');

module.exports = db.defineModel('ord', {
    name: db.STRING(100),
    sub_name: db.STRING(100),
    user_id:db.STRING(100),
    status: db.INTEGER,
    end_time:db.BIGINT,
    amount:db.BIGINT
});
