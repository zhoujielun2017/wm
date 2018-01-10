const db = require('../db');

module.exports = db.defineModel('design_img', {
    content: {
    	type: db.STRING(1000),
    	allowNull: true
    },
    design_id:db.STRING(64),
    img: db.STRING(1000),
    sort: db.BIGINT
});
