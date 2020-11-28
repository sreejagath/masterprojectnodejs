var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/student/student-login', function(req, res, next) {
  if(req.session.tutorLoggedIn){
    console.log('not logged');
    res.render('tutor/view-students');
  }else{
    console.log("not logged in as tutor");
    res.render('student/student-login');
  }
});
router.get('/student/student-signup', function(req, res, next) {
  console.log("login page");
  res.render('student/student-signup');
})
router.post('/student-signup',(req,res)=>{
  studentHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
  })
})
module.exports = router;
