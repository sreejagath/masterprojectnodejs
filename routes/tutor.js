var express = require('express');
var router = express.Router();

const tutorHelpers=require('../helpers/tutor-helpers');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/tutor-login', function(req, res, next) {
  if(req.session.tutorLoggedIn){
    res.render('tutor/tutor-home');
  }else{
    console.log("login page");
    res.render('tutor/tutor-login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }
  });
  router.post('/tutor-login', function(req, res, next) {
    tutorHelpers.doLogin(req.body).then((response)=>{
      console.log(response);
      if(response.status){
      req.session.tutorLoggedIn=true
      req.session.tutor=response.tutor
      res.render('tutor/tutor-home');
      }else{
        req.session.loginErr=true;
        res.redirect('tutor-login');
      }
    })
  });
  router.post('/tutor-signup',(req,res)=>{
    tutorHelpers.doSignup(req.body).then((response)=>{
      console.log(response);
    })
  })
router.get('/tutor-home', function(req, res, next) {
    let tutor=req.session.tutor
    console.log("login");
    res.render('tutor/tutor-home',{tutor});
  })
  router.get('/tutor-signup', function(req, res, next) {
    console.log("login page");
    res.render('tutor/tutor-signup');
  })
router.get('/logout',function(req,res,next){
  req.session.destroy()
  res.render('index')
})
router.get('/student/student-login',function(req,res,next){
  if(req.session.tutorLoggedIn){
    console.log('not logged');
    res.render('tutor/view-students');
  }else{
    console.log("not logged in as tutor");
    res.render('student/student-login');
  }
})
router.get('/tutor-profile', function(req, res, next) {
  console.log("Profile Page");
  res.render('tutor/tutor-profile');
})
module.exports = router;
