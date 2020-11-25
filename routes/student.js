var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/student/student-login', function(req, res, next) {
  console.log("login page");
  res.render('student/student-login');
});
module.exports = router;
