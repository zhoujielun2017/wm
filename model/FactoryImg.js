const db = require('../db');

module.exports = db.defineModel('factory_img', {
    content: {
    	type: db.STRING(1000),
    	allowNull: true
    },
    factory_id:db.STRING(64),
    img: db.STRING(1000),
    sort: db.BIGINT
});
