var express = require('express');
var router = express.Router();
var notification=require('../config/notification')
const tutorHelpers=require('../helpers/tutor-helpers');
const studentHelpers=require('../helpers/student-helpers');
// const { Path } = require('progressbar.js');
var fs = require('file-system');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: '../public/data/uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
var upload = multer({ storage: storage })
/* GET users listing. */
const verifyLogin = (req, res,next) => {
  if (req.session.tutorLoggedIn) {
    next();
  } else {
    console.log("login page");
    res.render("tutor/tutor-login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
};

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
router.get('/tutor-home',verifyLogin,async function(req, res, next) {
  console.log("Ajax is here");
 const date=new Date().toLocaleDateString(undefined,{
   month:'2-digit',
   day:'2-digit',
     year:'numeric',
    hour:'2-digit',
    minute:'2-digit'
 })
 console.log(date);
  var dateobj = new Date();
 function pad(n) {return n < 10 ? "0"+n : n;}
 var result = pad(dateobj.getDate())+"/"+pad(dateobj.getMonth()+1)+"/"+dateobj.getFullYear();
 console.log(result);
      let tutor=req.session.tutor
      let announcement=await tutorHelpers.getAnnouncements()
      res.render('tutor/tutor-home',{tutor,announcement});
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
    res.redirect('/tutor/tutor-profile')
    if(req.files.image){
      req.files.image.mv('./public/images/tutor-images/'+id+'.jpg')
    }
  })
  
})
router.get('/student-control',verifyLogin,function(req,res,next){
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
  studentHelpers.doSignup(req.body).then((id)=>{
    res.redirect('/tutor/student-control')
    if(req.files.studentimage){
      req.files.studentimage.mv('./public/images/student-images/'+id+'.jpg')
    }
  })
})
router.get('/edit-student/:id',async(req,res)=>{
  console.log(req.params.id);
  let studentslist= await tutorHelpers.getStudentDetails(req.params.id)
  res.render('tutor/edit-student',{studentslist})
})
router.post('/edit-student/:id',(req,res)=>{
  tutorHelpers.updateStudent(req.params.id,req.body).then(()=>{
    res.redirect('/tutor/student-control')
    var id=req.params.id;
    if(req.files.studentimage){
      req.files.studentimage.mv('./public/images/student-images/'+id+'.jpg')
    }
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
    res.redirect('/tutor/student-control')
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
router.get('/remove-student/:id',async(req,res)=>{
  let studentid=req.params.id;
  console.log(studentid);
  tutorHelpers.deleteStudent(studentid).then((response)=>{
    res.redirect('/tutor/student-control')
  })
})
router.get('/add-assignments',(req,res)=>{
  tutorHelpers.getAssignments().then((all_assignments)=>{
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    let present=(date + "/" + month + "/" + year+","+strTime);
    res.render('tutor/add-assignments',{all_assignments,present})
  })
    
})
router.post('/add-assignments',(req,res)=>{
  console.log("Ajax worked successfully");
  tutorHelpers.addAssignments(req.body).then((response)=>{
    notification.student=true
    
    res.redirect('/tutor/tutor-home')
    if(req.files.assignment){
      let assignment=req.files.assignment
      let topic=req.body.topic
      assignment.mv('./public/data/assignments/'+topic+'.pdf')
    }
  })
})
router.get('/view-student-details/:id',async(req,res)=>{
  let student=await tutorHelpers.getStudentDetails(req.params.id)
  console.log(student);
      res.render('tutor/view-student-details',{student})
  
})
router.get('/upload-notes',(req,res)=>{
  tutorHelpers.getNotes().then((all_notes)=>{
  res.render('tutor/upload-notes',{all_notes})
  })
})
router.post('/upload-notes',(req,res)=>{
    if(req.files.notes){
      tutorHelpers.addNotes(req.body,req.files.notes.mimetype).then((response)=>{
      console.log(req.body.notes);
      let notes=req.files.notes
      let topic=req.body.topic
      notes.mv('./public/data/notes/'+'pdf_note_'+topic+'.pdf')
    })
  }
    if(req.files.video){
      console.log(req.body.notes);
      let video=req.files.video
      let topic=req.body.topic
      video.mv('./public/data/notes/'+'video'+topic+'.mp4')
    }res.redirect('/tutor/tutor-home')
  
})
router.get('/attendance',(req,res)=>{
  studentHelpers.getStudents().then(async(studentslist)=>{
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let present=(date + "/" + month + "/" + year);
    console.log(present);
    if(notification.attendance===true){
       presentstudent="P";
    }else{
       presentstudent="A";
    }
    console.log(notification.attendance);
    console.log("attendance");
    console.log(presentstudent);
    let attendance=await tutorHelpers.thisDay(studentslist)
    console.log(attendance);
      res.render('tutor/attendance',{studentslist,presentstudent,present})
  })
})
router.get('/delete-assignment/:id',(req,res)=>{
  console.log("deleting");
  let assignmentid=req.params.id;
  tutorHelpers.deleteAssignment(assignmentid).then((response)=>{
    res.redirect('/tutor/add-assignments')
  })
})
router.get('/delete-notes/:id',(req,res)=>{
  let notesid=req.params.id;
  tutorHelpers.deleteNotes(notesid).then((response)=>{
    res.redirect('/tutor/upload-notes')
  })
})
router.get('/announcements',async(req,res)=>{
  let announcements=await tutorHelpers.getAnnouncements()
  res.render('tutor/announcements',{announcements})
})
router.post('/announcements',(req,res)=>{
  tutorHelpers.addAnnouncements(req.body).then(()=>{
   if(req.files.announcementdetail){
      let doc=req.files.announcementdetail
      let announcement=req.body.Announcement
      doc.mv('./public/data/announcement/'+announcement+'_img.jpg')
    }
    res.redirect('/tutor/tutor-home')
  })
})
router.get('/file-upload',(req,res)=>{
  res.render('tutor/file-upload')
})
router.post('/file-upload',(req,res)=>{
  res.redirect('/tutor/file-upload')
})
router.get('/ajax',(req,res)=>{
  res.render('tutor/ajax-try')
})
router.get('/events',(req,res)=>{
  let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let present=(date + "/" + month + "/" + year);
  res.render('tutor/events',{present})
})
router.post('/events',(req,res)=>{
  tutorHelpers.addEvents(req.body).then(()=>{
    res.redirect('/tutor/tutor-home')
  })
})
router.get("/uploadfile",(req,res)=>{
  res.render("tutor/upload")
})
// Single file
router.post('/uploadfile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.files);
  console.log(upload);
  console.log(upload.storage.DiskStorage);
  if(req.files.avatar.mimetype=='image/jpeg'){
    
  }
    res.redirect('/tutor/uploadfile')
})

// router.post("/upload/single", uploadStorage.single("file"), (req, res) => {
//   console.log(req.file)
//   res.redirect("/tutor/upload")
// })
module.exports = router;
