const db = require('../db');

module.exports = db.defineModel('wikimenu', {
    parent_id: db.STRING(32),
    root_id: db.STRING(32),
    wiki_id: db.STRING(32),
    name: db.STRING(32),
    sort: db.BIGINT
});
