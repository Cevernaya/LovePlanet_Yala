const express = require('express');
const router = express.Router();
const sqlite = require('better-sqlite3');

const path = require('path')

router.get('/test-list', (req, res) => {
    let db = new sqlite(path.join(__dirname, '../', 'database', 'chinook.db'));
    const rows = db.prepare("SELECT * FROM albums").all();

    const filtered = rows.map(row => {
        return row
    })

    res.send(filtered);
    db.close()
})

router.get('/study', (req, res) => {
    const tablename = req.query.table;
    let db = new sqlite(path.join(__dirname, '../', 'database', 'database.db'));
    const rows = db.prepare(`SELECT * FROM ${tablename}`).all();
    
    const filtered = rows.map(row => {
        return row
    })

    res.send(filtered);
    db.close()
})

router.get('/gogup', (req, res) => {
    const tablename = req.query.table;
    let db = new sqlite(path.join(__dirname, '../', 'database', 'database.db'));
    const rows = db.prepare(`SELECT * FROM ${tablename}`).all();

    const filtered = rows.filter((item, idx) => {
        return item.to_user === 2
    });
    res.send(filtered);
    db.close()
})



module.exports = router
