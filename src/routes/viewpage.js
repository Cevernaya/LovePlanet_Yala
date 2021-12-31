var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});

router.get('/reviews', function(req, res, next) {
  res.render('reviews', { title: 'Express' });
});

router.get('/announce', function(req, res, next) {
  res.render('announce', { title: 'Express' });
});

router.get('/lovecoin', function(req, res, next) {
  res.render('lovecoin', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
  res.render('users', { title: 'Express' });
});

router.get('/newUser', function(req, res, next) {
  res.render('newUser', { title: 'Express' });
});

router.get('/userShow', function(req, res, next) {
  res.render('userShow', { title: 'Express' });
});

router.get('/snsAnalysis', function(req, res, next) {
  res.render('snsAnalysis', { title: 'Express' });
});

router.get('/insta_jongsoo', function(req, res, next) {
  res.render('insta_jongsoo/insta_jongsoo');
});

router.get('/phoneReview', function(req, res, next) {
  res.render('phoneReview');
});

module.exports = router;
