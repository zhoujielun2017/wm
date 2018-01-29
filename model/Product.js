const db = require('../db');

module.exports = db.defineModel('product', {
    title: db.STRING(500),
    price: db.BIGINT,
    material: db.STRING(100),
    default_img: {
    	type: db.STRING(500),
    	allowNull: true
    },
    factory_id: db.STRING(64),
    type: {
    	type: db.STRING(64),
    	allowNull: true
    },
    user_id: db.STRING(32),
    status: db.INTEGER,
    sort: db.INTEGER,
    imgs: {
    	type: db.STRING(2000),
    	allowNull: true
    },
    content: db.STRING(1000)
});
