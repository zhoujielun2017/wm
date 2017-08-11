const db = require('../db');

module.exports = db.defineModel('nav', {
    name: db.STRING(50),
    url: db.STRING(512),
    sort: db.BIGINT
});
