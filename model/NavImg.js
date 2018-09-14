const db = require('../db');

module.exports = db.defineModel('nav_img', {
    name: db.STRING(50),
    url: db.STRING(512),
    img: db.STRING(512),
    sort: db.BIGINT,
    type: db.STRING(8),
});
