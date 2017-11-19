const db = require('../db');

module.exports = db.defineModel('design_exp', {
    design_id:db.STRING(32),
    experience: db.STRING(1000)
});
