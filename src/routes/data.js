const express = require('express');
const moment = require('moment')
require('moment-timezone')

const { forceLogin, alertLogin } = require('../utils/loginHandler')
const logger = require('../config/winston')


const routerGenerator = (db) => {
    const router = express.Router();

    router.get('/login', (req, res) => {
        const invitation_code = req.query.invitation_code
        logger.info(`Login Tried: ${invitation_code}`)
        const rows = db.prepare(`SELECT * FROM users WHERE invitation_code='${invitation_code}'`).all()
        if(rows.length == 0) {
            res.send({success: false});
            return;
        }
    
        if(!req.session.invitation_code) {
            req.session.invitation_code = invitation_code
            req.session.user_id = rows[0].user_id
            if(!rows[0].first_login) {
                db.prepare(`UPDATE users SET first_login='${moment().tz('Asia/Seoul').format()}' WHERE user_id=${req.session.user_id}`).run()
            }
            res.send({success: true})
        }
        else {
            res.send({success: false})
        }
    })
    
    router.get('/logout', (req, res) => {
        req.session.destroy()
        res.send({success: true})
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
        const user_id = req.query.user_id
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

    router.get('/sessionUserData', alertLogin, (req, res) => {
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
    
    router.get('/reviews', alertLogin, (req, res) => {
        const to_user = req.query.to_user
    
        const toUserData = db.prepare(`SELECT * FROM users WHERE user_id=${to_user}`).all()
        if(toUserData.length == 0) {
            res.send({
                success: false,
                message: '해당 유저가 존재하지 않습니다!'
            })
            return
        }
        else if(!toUserData[0].movie_character && to_user != req.session.user_id) {
            res.send({
                success: false,
                message: '다른 실제 인물의 리뷰를 볼 수 없습니다!'
            })
            return
        }
    
        const rows = db.prepare(`
            SELECT 
                r.review_id review_id,
                r.rating review_rating,
                r.body review_body,
                r.locked review_locked,
                r.cost review_cost,
                fu.rank fu_rank,
                fu.name fu_name,
                fu.profile_image fu_profile_image,
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
    
    router.get('/notices', alertLogin, (req, res) => {
        const user_id = req.session.user_id;
        const rows = db.prepare(`
            SELECT n.title title, n.body body, n.notice_id notice_id
            FROM notices n
            JOIN users u
            ON n.user_id = u.user_id
            WHERE u.user_id='${user_id}'
        `).all();
        res.send({
            success: true,
            notices: rows
        })
    })
    
    router.post('/writeReview', alertLogin, (req, res) => {
        const from_user = req.session.user_id
        const to_user = req.body.to_user
        const rating = req.body.rating
        const body = req.body.body
    
        const toUserData = db.prepare(`SELECT * FROM users WHERE user_id=${to_user}`).all()
        if(toUserData.length == 0) {
            res.send({
                success: false,
                message: '해당 유저가 존재하지 않습니다!'
            })
            return
        }
        else if(!toUserData[0].movie_character) {
            res.send({
                success: false,
                message: '실제 인물에게 리뷰를 달 수 없습니다!'
            })
            return
        }
    
        const runResult = db.prepare(`
            INSERT INTO reviews
            (from_user, to_user, rating, body, locked) VALUES
            (${from_user}, ${to_user}, ${rating}, '${body}', 0)
        `).run()
    
        res.send({
            success: true,
            result: runResult
        })
    
    })

    router.get('/unlockReview', alertLogin, (req, res) => {
        const user_id = req.session.user_id
        const review_id = req.query.review_id

        const nowLovecoin = db.prepare(`SELECT lovecoin FROM users WHERE user_id=${user_id}`).all()
        if(!nowLovecoin) {
            res.send({
                success: false,
                message: "해당 유저가 존재하지 않습니다!"
            })
            return
        }

        const nowReview = db.prepare(`SELECT * FROM reviews WHERE review_id=${review_id}`).all()
        if(!nowReview) {
            res.send({
                success: false,
                message: "해당 리뷰가 존재하지 않습니다!"
            })
            return
        }
        
        if(!nowReview[0].locked) {
            res.send({
                success: false,
                message: "이미 열려있는 리뷰입니다!"
            })
            return
        }
        
        if(nowLovecoin[0].lovecoin < nowReview[0].cost) {
            res.send({
                success: false,
                message: "보유 러브코인이 부족합니다!"
            })
            return
        }

        const newLovecoin = nowLovecoin[0].lovecoin - nowReview[0].cost
        db.prepare(`UPDATE users SET lovecoin=${newLovecoin} WHERE user_id=${user_id}`).run()
        db.prepare(`UPDATE reviews SET locked=0 WHERE review_id=${review_id}`).run()

        const newReview = db.prepare(`SELECT * FROM reviews WHERE review_id=${review_id}`).all()
        res.send({
            success: true,
            review: newReview[0]
        })
        
    })
    
    router.get('/nowLovecoin', alertLogin, (req, res) => {
        const user_id = req.session.user_id
        const nowLovecoin = db.prepare(`SELECT lovecoin FROM users WHERE user_id=${user_id}`).all()[0].lovecoin
    
        res.send({
            success: true,
            nowLovecoin: nowLovecoin
        })
    })
    
    router.post('/addLovecoin', alertLogin, (req, res) => {
        const user_id = req.session.user_id
        const diffLovecoin = req.body.diffLovecoin
        
        const nowLovecoin = db.prepare(`SELECT lovecoin FROM users WHERE user_id=${user_id}`).all()[0].lovecoin
        const afterLovecoin = nowLovecoin + diffLovecoin
        
        if(afterLovecoin < 0) {
            res.send({
                success: false,
                message: '러브코인이 적어 작업을 수행할 수 없습니다!',
                nowLovecoin: nowLovecoin
            })
            return
        }
    
        db.prepare(`
            UPDATE users
            SET lovecoin=${afterLovecoin}
            WHERE user_id=${user_id}
        `).run()
    
        const result = db.prepare(`SELECT lovecoin FROM users WHERE user_id=${user_id}`).all()[0].lovecoin
    
        res.send({
            success: true,
            nowLovecoin: result
        })
    
    })
    
    router.get('/getMovieReviews', (req, res) => {
        const user_id = req.session.user_id
        const reviews = db.prepare(`SELECT * FROM movie_reviews ORDER BY movie_review_id DESC`).all()
    
        const filtered = reviews.map(review => {
            if(review.hidden && review.user_id != user_id) {
                review.body = "비밀 댓글입니다."
            }
            return review
        })
    
        res.send({
            success: true,
            reviews: filtered
        })
    })
    
    router.post('/writeMovieReview', alertLogin, (req, res) => {
        const user_id = req.session.user_id
        const user_name = req.body.user_name
        const body = req.body.body
        const hidden = req.body.hidden
    
        const runResult = db.prepare(`
            INSERT INTO movie_reviews
            (user_id, user_name, body, hidden) VALUES
            (${user_id}, '${user_name}', '${body}', ${hidden})
        `).run()
    
        res.send({
            success: true,
            result: runResult
        })
    })

    router.get('/rankDodge', (req, res) => {
        const ranks = db.prepare(`SELECT nickname, score FROM dodge_ranking ORDER BY score DESC LIMIT 10`).all()
        res.send({ success: true, ranks })
    })

    router.post('/rankDodgeAdd', alertLogin, (req, res) => {
        const user_id = req.session.user_id
        const name = req.body.name
        const score = req.body.score

        const runResult = db.prepare(`
            INSERT INTO dodge_ranking
            (user_id, nickname, score) VALUES
            (${user_id}, '${name}', ${score})
        `).run()

        res.send({
            success: true,
            result: runResult
        })
    })

    router.get('/rankGraph', (req, res) => {
        const ranks = db.prepare(`SELECT score FROM graph_ranking ORDER BY score DESC LIMIT 10`).all()
        res.send({ success: true, ranks })
    })

    router.post('/rankGraphAdd', alertLogin, (req, res) => {
        const user_id = req.session.user_id
        const score = req.body.score

        const runResult = db.prepare(`
            INSERT INTO graph_ranking
            (user_id, score) VALUES
            (${user_id}, ${score})
        `).run()

        res.send({
            success: true,
            result: runResult
        })
    })

    return router
}

/** ENDPOINTS **/





module.exports = routerGenerator
