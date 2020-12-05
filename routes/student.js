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
const nodemailer = require("nodemailer");
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
router.get('/otp-login',(req,res)=>{
  res.render('student/otp-login')
})
var email;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'casper.mcclure@ethereal.email',
      pass: 'DTefu7T3jUkSfRYRdD'
  }
});

router.post('/otp-login',async(req,res)=>{
  let stpresent=await studentHelpers.findEmail(req.body.studentmail)
  if(stpresent){
    
    email=req.body.studentmail;
    var mailOptions={
      to: req.body.studentmail,
     subject: "OTP - Class Room Management System ",
     html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
   };
   transporter.sendMail(mailOptions, (error,info) => {
    if (error) {
      return console.log(error);
  }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    res.render('student/verify-otp')
  }) 
  }else{
    res.render('student/otp-login')
  }
})
router.get('/verify-otp',(req,res)=>{
  res.render('student/verify-otp')
})
router.post('/verify-otp',(req,res)=>{
  
  if(req.body.otp==otp){
    res.render('student/student-home');
}
else{
    res.render('student/otp-login');
}
})
module.exports = router;
