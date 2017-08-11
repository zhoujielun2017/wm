const db = require('../db');

module.exports = db.defineModel('user', {
    role: db.BIGINT,
    name: db.STRING(100),
    email: db.STRING(100),
    verified: db.BIGINT,
    head_url: db.STRING(1000),
});
