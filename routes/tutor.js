var express = require('express');
var router = express.Router();

const tutorHelpers=require('../helpers/tutor-helpers');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.render('tutor/tutor-main');
});
router.get('/tutor-login', function(req, res, next) {
    console.log("login page");
    res.render('tutor/tutor-login');
  });
  router.post('/tutor-signup',(req,res)=>{
    tutorHelpers.doSignup(req.body).then((response)=>{
      console.log(response);
    })
  })
router.get('/tutor-home', function(req, res, next) {
    console.log("login");
    res.render('tutor/tutor-home');
  });
  router.get('/tutor-signup', function(req, res, next) {
    console.log("login page");
    res.render('tutor/tutor-signup');
  }); 
  
module.exports = router;
