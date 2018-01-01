const db = require('../db');

module.exports = db.defineModel('product_img', {
    content: {
    	type: db.STRING(1000),
    	allowNull: true
    },
    product_id:db.STRING(64),
    img: db.STRING(1000),
    sort: db.BIGINT
});
