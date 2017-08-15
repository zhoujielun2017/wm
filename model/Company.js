const db = require('../db');

module.exports = db.defineModel('company', {
    name: db.STRING(500),
    ename: db.STRING(500),
    address: db.STRING(500),
    legal_person: db.STRING(20),
    phone: db.STRING(20),
    custom_service: db.STRING(100),
    phone: db.STRING(20),
    email: db.STRING(100),
    content: db.STRING(1000)
});
