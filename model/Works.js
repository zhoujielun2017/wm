const db = require('../db');

module.exports = db.defineModel('works', {
    title: db.STRING(500),
    price: db.DOUBLE,
    material: db.STRING(100),
    default_img: {
    	type: db.STRING(500),
    	allowNull: true
    },
    user_id: db.STRING(32),
    status: db.INTEGER,
    imgs: {
    	type: db.STRING(2000),
    	allowNull: true
    },
    content: db.STRING(1000)
});
