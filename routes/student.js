var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});router.get('/student-login', function(req, res, next) {
  if(req.session.studentLoggedIn){
    res.render('student/student-home');
  }else{
    console.log("login page");
    res.render('student/student-login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }
  });
  router.post('/student-login', function(req, res, next) {
    studentHelpers.doLogin(req.body).then((response)=>{
      console.log(response);
      if(response.status){
      req.session.studentLoggedIn=true
      req.session.student=response.student
      res.render('student/student-home');
      }else{
        req.session.loginErr=true;
        res.redirect('student-login');
      }
    })
  });
  router.post('/student-signup',(req,res)=>{
    studentHelpers.doSignup(req.body).then((response)=>{
      console.log(response);
    })
  })
router.get('/student-home', function(req, res, next) {
    let student=req.session.student
    console.log("login");
    res.render('student/student-home',{student});
  })
  router.get('/student/student-signup', function(req, res, next) {
    console.log("login page");
    res.render('student/student-signup');
  })
router.get('/logout',function(req,res,next){
  req.session.destroy()
  res.render('index')
})
router.get('/student/student-login',function(req,res,next){
  if(req.session.studentLoggedIn){
    console.log('not logged');
    res.render('student/view-students');
  }else{
    console.log("not logged in as student");
    res.render('student/student-login');
  }
})
module.exports = router;
