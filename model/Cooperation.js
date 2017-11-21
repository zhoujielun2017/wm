const db = require('../db');

module.exports = db.defineModel('cooperation', {
    name: db.STRING(100),
    type:db.STRING(20),
    factory_id:db.STRING(32)
});
