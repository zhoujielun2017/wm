const db = require('../db');

module.exports = db.defineModel('message', {
	group_id:db.STRING(128),
    sender_id: db.STRING(32),
    receiver_id: db.STRING(32),
    status: db.INTEGER,
    content: db.STRING(1000)
});
