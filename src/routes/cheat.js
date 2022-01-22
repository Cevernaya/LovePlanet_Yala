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

        db.prepare(`UPDATE reviews SET locked=0 WHERE to_user=${user_id}`).run()
        db.prepare(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '치트 사용: 모든 리뷰 잠금해제', '관리자에 의해 모든 잠금이 해제되었습니다. 즐거운 러브플래닛 이용 되세요!')`).run()

        res.send({ success: true })
    })

    router.get('/copyLovecoin', (req, res) => {
        const user_id = req.session.user_id

        if(!user_id) {
            res.send({ success: false })
            return
        }

        db.prepare(`UPDATE users SET lovecoin=1000000000000 WHERE user_id=${user_id}`).run()
        db.prepare(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '치트 사용: 러브코인은 신이고 나는 무적이다', '관리자에 의해 보유 러브코인이 수정되었습니다. 즐거운 러브플래닛 이용 되세요!')`).run()

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
            db.prepare(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '치트 사용: 제가 찾던 모든 정보 여기 있네요~', '관리자에 의해 섬세한 리뷰 관리를 마쳤습니다. 즐거운 러브플래닛 이용 되세요!')`).run()
        }

        res.send({ success: true })
    })

    return router
}

module.exports = routerGenerator