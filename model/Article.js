const db = require('../db');

module.exports = db.defineModel('article', {
    visit: db.BIGINT,
    title: db.STRING(100),
    tag: db.STRING(100),
    content: db.STRING(10000)
});
