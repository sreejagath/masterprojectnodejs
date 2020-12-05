var express = require('express');
var router = express.Router();

const tutorHelpers=require('../helpers/tutor-helpers');
const studentHelpers=require('../helpers/student-helpers');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/tutor-login', function(req, res, next) {
  if(req.session.tutorLoggedIn){
    res.render('tutor/tutor-home');
  }else if(req.session.studentLoggedIn){
    res.render('student/view-teachers')
  }
    else{
    console.log("login page");
    res.render('tutor/tutor-login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }
  });
  router.post('/tutor-login', function(req, res, next) {
    tutorHelpers.doLogin(req.body).then((response)=>{
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
  tutorHelpers.getTutorDetails(req.body).then((tutordetails)=>{
    console.log(tutordetails)
    console.log("login");
    res.render('tutor/tutor-profile',{tutordetails});
  })
})
router.get('/edit-profile/:id', async(req, res)=>{
  let tutordetails= await tutorHelpers.getTutorDetails(req.params.id)
    console.log("Edit Profile");
    console.log(tutordetails);
    console.log(req.params.id);
    console.log("hello");
  res.render('tutor/edit-profile',{tutordetails});

})
router.post('/edit-profile/:id',function(req,res,next){
  let id=req.params.id
  tutorHelpers.updateDetails(req.params.id,req.body).then(()=>{
    res.render('tutor/tutor-home')
    if(req.files.image){
      req.files.image.mv('./public/images/tutor-images/'+id+'.jpg')
    }
  })
  
})
router.get('/student-control',function(req,res,next){
  console.log("hello");
  console.log(req.params.id);
  studentHelpers.getStudents().then((studentslist)=>{
    res.render('tutor/student-control',{studentslist})
  })
})
router.get('/add-student',function(req,res,next){
  
  res.render('tutor/add-student')
})
router.post('/add-student',(req,res)=>{
  studentHelpers.doSignup(req.body).then((response)=>{
    //let image=req.files.studentimage
    //console.log(image);
    //console.log(id);
    //image.mv('./images/student-images'+id+'.jpg',(err)=>{
      //if(!err){
        //console.log(response);
    res.render('tutor/student-control')
      //}else{
        //console.log(err);
      //}
    //}
    //)
    
  })
})
router.get('/edit-student/:id',async(req,res)=>{
  console.log(req.params.id);
  let studentslist= await tutorHelpers.getStudentDetails(req.params.id)
  res.render('tutor/edit-student',{studentslist})
})
router.post('/edit-student/:id',(req,res)=>{
  tutorHelpers.updateStudent(req.params.id,req.body).then(()=>{
    res.render('tutor/tutor-home')
  })
})
router.get('/edit-image/:id',async(req,res)=>{
  let student= await tutorHelpers.getStudentDetails(req.params.id)
  res.render('tutor/edit-image',{student})
})
router.post('/edit-image/:id',(req,res)=>{
  let id=req.params.id
  console.log(req.params.id);
  let image=req.files.image
  console.log(image);
  image.mv('./public/images/student-images/'+id+'.jpg',(err)=>{
    if(!err){
    res.render('tutor/tutor-home')
    }else{
      console.log(err);
    }
  })
  
})
router.get('/view-tutor-profile/:id',async(req,res)=>{
  let tutordetails= await tutorHelpers.getTutorDetails(req.params.id)
    console.log(tutordetails)
    res.render('tutor/view-tutor-profile',{tutordetails});
  
})
module.exports = router;
