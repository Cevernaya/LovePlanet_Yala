const express = require('express');
const router = express.Router();
const path = require('path')
const sqlite = require('better-sqlite3');


/** INITIALIZE DATABASE **/

const db = new sqlite(path.join(__dirname, '../', 'database', 'database.db'));



/** ENDPOINTS **/

router.get('/login', (req, res) => {
    const invitation_code = req.query.invitation_code
    const rows = db.prepare(`SELECT * FROM users WHERE invitation_code='${invitation_code}'`).all()
    if(rows.length == 0) {
        res.send({success: false});
        return;
    }

    if(!req.session.invitation_code) {
        req.session.invitation_code = invitation_code
        req.session.user_id = rows[0].user_id
        res.send({success: true})
    }
    else {
        res.send({success: false})
    }
})

router.get('/movieChars', (req, res) => {
    const rows = db.prepare(`SELECT * FROM users WHERE movie_character=1`).all();
    res.send({
        success: true,
        movieChars: rows
    })
})

router.get('/userData', (req, res) => {
    const invitation_code = req.session.invitation_code
    const user_id = req.session.user_id
    const user = db.prepare(`SELECT * FROM users WHERE user_id=${user_id}`).all()
    if(user[0].invitation_code !== invitation_code && user[0].movie_character === 0) {
        res.send({success: false})
        return
    }
    
    res.send({
        success: true,
        sessionUser: user
    })
})

router.get('/reviews', (req, res) => {
    const to_user = req.query.to_user
    const rows = db.prepare(`
        SELECT 
            r.review_id review_id,
            r.rating review_rating,
            r.body review_body,
            r.locked review_locked,
            fu.rank fu_rank,
            fu.name fu_name,
            tu.rank tu_rank,
            tu.name tu_name
        FROM reviews r
        JOIN users fu
        ON r.from_user = fu.user_id
        JOIN users tu
        ON r.to_user = tu.user_id
        WHERE r.to_user=${to_user}
    `).all();
    const filtered = rows.map(row => {
        if(row.review_locked) {
            row.review_rating = 0;
            row.review_body = '잠겨 있는 리뷰입니다.';
        }
        return row;
    })
    res.send({
        success: true,
        reviews: filtered
    })
})

router.get('/notices', (req, res) => {
    const invitation_code = req.session.invitation_code;
    const rows = db.prepare(`
        SELECT n.title title, n.body body, n.notice_id notice_id
        FROM notices n
        JOIN users u
        ON n.user_id = u.user_id
        WHERE u.invitation_code='${invitation_code}'
    `).all();
    res.send({
        success: true,
        notices: rows
    })
})



module.exports = router
