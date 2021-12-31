const express = require('express');
const router = express.Router();

router.get('/setSession', (req, res) => {
    const invitation_code = req.query.invitation_code
    if(!req.session.invitation_code) {
        req.session.invitation_code = invitation_code
        res.send({success: true})
    }
    else {
        res.send({success: false})
    }
})

router.get('/checkSession', (req, res) => { // DEBUG ONLY
    if(process.env.DEBUG) res.send(req.session)
})


module.exports = router