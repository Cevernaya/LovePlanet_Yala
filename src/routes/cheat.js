const express = require('express');

const randomPraise = require('../database/randomPraise')
const { forceLogin, alertLogin } = require('../utils/loginHandler')

const cyrb53 = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};


const routerGenerator = (db) => {
    const router = express.Router()

    router.use(forceLogin)

    router.get('/unlockEveryReview', (req, res) => {
        const user_id = req.session.user_id

        if (!user_id) {
            res.send({ success: false })
            return
        }

        db.query(`UPDATE reviews SET locked=0 WHERE to_user=${user_id}`)
        db.query(`UPDATE users SET reviews_unlocked=1000000, \`rank\`=10, director_unlocked=1 WHERE user_id=${user_id}`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '${req.session.user_name} 회원 관리자 권한 부여 - 모든 리뷰 잠금 해제', '관리자에 의해 모든 잠금이 해제되었습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/resetReview', (req, res) => {
        const user_id = req.session.user_id

        if (!user_id) {
            res.send({ success: false })
            return
        }

        db.query(`UPDATE users SET reviews_unlocked=1, \`rank\`=10 WHERE user_id=${user_id}`)
        db.query(`DELETE FROM reviews WHERE to_user=${user_id}`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '${req.session.user_name} 회원 관리자 권한 부여 - 악성 리뷰 제거', '관리자에 의해 리뷰가 초기화되었습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/deleteBadReview', (req, res) => {
        const user_id = req.session.user_id

        if (!user_id) {
            res.send({ success: false })
            return
        }

        db.query(`UPDATE users SET bad_changed=1, \`rank\`=10 WHERE user_id=${user_id}`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '${req.session.user_name} 회원 관리자 자격 부여 – 악성 리뷰 제거', '관리자에 의해 악성 리뷰가 제거되었습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/copyLovecoin', (req, res) => {
        const user_id = req.session.user_id

        if (!user_id) {
            res.send({ success: false })
            return
        }

        db.query(`UPDATE users SET lovecoin=1000000000000, \`rank\`=10 WHERE user_id=${user_id}`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '${req.session.user_name} 회원 관리자 권한 부여 - 러브 코인 1조원 채굴 및 증정', '관리자에 의해 보유 러브코인이 수정되었습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/aiReview', (req, res) => {
        const user_id = req.session.user_id

        if (!user_id) {
            res.send({ success: false })
            return
        }

        const reviewNum = 10
        for (let i = 0; i < reviewNum; i++) {
            const praiseStart = Math.floor(Math.random() * (randomPraise.length - 200))
            const praiseBody = randomPraise.slice(praiseStart, praiseStart + 200)

            db.query(`INSERT INTO reviews (from_user, to_user, rating, body, locked) VALUES (12, ${user_id}, 5, '${praiseBody}', 0)`)
        }
        db.query(`UPDATE users SET \`rank\`=10 WHERE user_id=${user_id}`)
        db.query(`INSERT INTO notices (user_id, title, body) VALUES (${user_id}, '${req.session.user_name}회원 관리자 자격 부여 – AI 자동 리뷰 생성', '관리자에 의해 섬세한 리뷰 관리를 마쳤습니다. 즐거운 러브플래닛 이용 되세요!')`)

        res.send({ success: true })
    })

    router.get('/makeuser', (req, res) => {
        if (req.session.user_id !== 1) {
            res.send({ success: false })
            return
        }
        const num = parseInt(req.query.num)
        for (let i = 0; i < num; i++) {
            const seed = +new Date() + i
            const code = cyrb53(`${seed}`).toString(16).slice(0, 10).toUpperCase()

            db.query(`INSERT INTO users (invitation_code) VALUES ('${code}')`)
        }

        res.send({
            success: true
        })
    })

    return router
}

module.exports = routerGenerator