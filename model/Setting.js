const db = require('../db');

module.exports = db.defineModel('setting', {
    name: db.STRING(50),
    value: db.STRING(512)
});
