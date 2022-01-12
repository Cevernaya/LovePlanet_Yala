var express = require('express');
var router = express.Router();

const { forceLogin, alertLogin } = require('../utils/loginHandler')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/announce', forceLogin, function(req, res, next) {
  res.render('announce', { title: 'Express' });
});

router.get('/lovecoin', forceLogin, function(req, res, next) {
  res.render('lovecoin', { title: 'Express' });
});

router.get('/lovecoin_chart', forceLogin, function(req, res, next) {
  res.render('lovecoin_chart', { title: 'Express' });
});

router.get('/users', forceLogin, function(req, res, next) {
  res.render('users', { title: 'Express' });
});

router.get('/userShow', forceLogin, function(req, res, next) {
  res.render('userShow', { title: 'Express' });
});

router.get('/cheat', forceLogin, function(req, res, next) {
  res.render('cheat');
});

router.get('/systemFeedback', forceLogin, function(req, res, next) {
  res.render('movieReview');
});

module.exports = router;
