var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.render('tutor/tutor-main');
});
router.get('/tutor-login', function(req, res, next) {
    console.log("login page");
    res.render('tutor/tutor-login');
  });
module.exports = router;
