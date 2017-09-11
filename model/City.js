const db = require('../db');

module.exports = db.defineModel('city', {
    code: db.STRING(64),
    name: db.STRING(64),
    parent_id: db.STRING(32)
});
