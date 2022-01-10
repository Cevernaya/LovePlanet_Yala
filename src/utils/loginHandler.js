const forceLogin = (req, res, next) => {
    if(!req.session.user_id) {
        res.status(301).redirect('/')
        return
    }
    next()
}

const alertLogin = (req, res, next) => {
    if(!req.session.user_id) {
        res.send({
            success: false,
            message: "로그인이 필요합니다."
        })
        return
    }
    next()
}

module.exports = { forceLogin, alertLogin }