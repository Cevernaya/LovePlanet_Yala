const express = require('express');

const randomPraise = require('../database/randomPraise')
const { forceLogin, alertLogin } = require('../utils/loginHandler')


const routerGenerator = (db) => {
    const router = express.Router()

    router.use(forceLogin)

    router.get('/unlockEveryReview', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        db.query(`UPDATE reviews SET locked=0 WHERE to_user=${user_id}`)
        db.query(`UPDATE users SET reviews_unlocked=1000000 WHERE user_id=${user_id}`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '치트 사용: 모든 리뷰 잠금해제', '관리자에 의해 모든 잠금이 해제되었습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/resetReview', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        db.query(`UPDATE users SET reviews_unlocked=1 WHERE user_id=${user_id}`)
        db.query(`DELETE FROM reviews WHERE to_user=${user_id}`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '치트 사용: 리뷰 초기화', '관리자에 의해 리뷰가 초기화되었습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/deleteBadReview', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        db.query(`DELETE FROM reviews WHERE to_user=${user_id} AND rating<3`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '치트 사용: 악성 리뷰 제거', '관리자에 의해 악성 리뷰가 제거되었습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/copyLovecoin', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        db.query(`UPDATE users SET lovecoin=1000000000000 WHERE user_id=${user_id}`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '치트 사용: 러브코인은 신이고 나는 무적이다', '관리자에 의해 보유 러브코인이 수정되었습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/aiReview', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        const reviewNum = 5
        for(let i=0; i<reviewNum; i++) {
            const praiseStart = Math.floor(Math.random() * (randomPraise.length - 200))
            const praiseBody = randomPraise.slice(praiseStart, praiseStart+200)

            db.query(`INSERT INTO reviews (from_user, to_user, rating, body, locked) VALUES (12, ${user_id}, ${Math.floor(Math.random() * 5 + 1)}, '${praiseBody}', 0)`)
        }
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '치트 사용: 제가 찾던 모든 정보 여기 있네요~', '관리자에 의해 섬세한 리뷰 관리를 마쳤습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    return router
}

module.exports = routerGenerator