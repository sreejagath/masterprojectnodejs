var express = require('express');
var router = express.Router();
const verifyLogin=(req,res)=>{
  if(req.session.studentLoggedIn){
  res.render('student/student-home');
}else{
  console.log("login page");
  res.render('student/student-login',{"loginErr":req.session.loginErr})
  req.session.loginErr=false
}
}
const studentHelpers=require('../helpers/student-helpers');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/student-login', function(req, res, next) {
  if(req.session.tutorLoggedIn){
    console.log('not logged');
    res.render('tutor/view-students');
  }else if(req.session.studentLoggedIn){
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
      console.log("Entering to Student Home");
      res.render('student/student-home');
      }else{
        req.session.loginErr=true;
        res.redirect('student-login');
      }
    })
  });
  router.post('student/student-signup',(req,res)=>{
    studentHelpers.doSignup(req.body).then((response)=>{
      console.log(response);
      res.render('/student/student-login');
    })
  })
  router.get('/logout',function(req,res,next){
    req.session.destroy()
    res.render('index')
  })
router.get('/student-home',verifyLogin, function(req, res, next) {
    let student=req.session.student
    console.log("login");
    if(student){
       res.render('student/student-home',{student});
    }else{
      res.render('student/student-login')
    }
   
  })
  router.get('/student-signup', function(req, res, next) {
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
    res.render('student/view-teachers');
  }else{
    console.log("not logged in as student");
    res.render('student/student-login');
  }
})
router.get('/tutor/view-teachers',(req,res)=>{
  res.render('student/view-teachers')
})
module.exports = router;
