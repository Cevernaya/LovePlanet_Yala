const express = require('express');
const router = express.Router();
const path = require('path')
const sqlite = require('better-sqlite3');


/** INITIALIZE DATABASE **/

const db = new sqlite(path.join(__dirname, '../', 'database', 'database.db'));



/** ENDPOINTS **/

router.get('/movieChars', (req, res) => {
    const rows = db.prepare(`SELECT * FROM users WHERE movie_character=1`).all();
    res.send(rows)
})

router.get('/sessionUser', (req, res) => {
    const invitation_code = req.session.invitation_code
    if(invitation_code === undefined) {
        res.send(0)
        return
    }
    
    const user = db.prepare(`SELECT * FROM users WHERE invitation_code=${invitation_code}`).all()
    res.send(user)
})



module.exports = router
