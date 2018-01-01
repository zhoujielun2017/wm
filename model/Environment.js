const db = require('../db');

module.exports = db.defineModel('environment', {
    imgs: db.STRING(5000)
});
