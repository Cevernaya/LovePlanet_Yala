const express = require('express');

const randomPraise = require('../database/randomPraise')


const routerGenerator = (db) => {
    const router = express.Router()

    router.get('/unlockEveryReview', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        db.prepare(`UPDATE reviews SET locked=0 WHERE to_user=${user_id}`).run()

        res.send({ success: true })
    })

    router.get('/copyLovecoin', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        db.prepare(`UPDATE users SET lovecoin=1000000000000 WHERE user_id=${user_id}`).run()

        res.send({ success: true })
    })

    router.get('/aiReview', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        const reviewNum = 20
        for(let i=0; i<reviewNum; i++) {
            const praiseStart = Math.floor(Math.random() * (randomPraise.length - 200))
            const praiseBody = randomPraise.slice(praiseStart, praiseStart+200)

            db.prepare(`INSERT INTO reviews (from_user, to_user, rating, body, locked) VALUES (12, ${user_id}, 5, '${praiseBody}', 0)`).run()
        }

        res.send({ success: true })
    })

    return router
}

module.exports = routerGenerator