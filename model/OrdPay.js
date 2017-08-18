const db = require('../db');

module.exports = db.defineModel('ord_pay', {
    ord_id: db.STRING(100),
    user_id:db.STRING(100),
    status: db.INTEGER,
    platform:db.STRING(20),
    outrade_no:db.STRING(100)
});
