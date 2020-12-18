const { response } = require("express");
var express = require("express");
var router = express.Router();
var notification = require("../config/notification");
var multer  = require('multer')
var upload = multer()
var collection = require("../config/collection");
var twilio = require('twilio')(collection.ACCOUNTSID,collection.AUTHTOKEN)
const verifyLogin = (req, res, next) => {
  if (req.session.studentLoggedIn) {
    next();
  } else {
    console.log("login page");
    res.render("student/student-login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
};
const nodemailer = require("nodemailer");
const tutorHelpers = require("../helpers/tutor-helpers");
const studentHelpers = require("../helpers/student-helpers");





/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/student-login", function (req, res, next) {
  if (req.session.tutorLoggedIn) {
    console.log("not logged");
    res.render("tutor/view-students");
  } else if (req.session.studentLoggedIn) {
    let studentDeatail = req.session.student;
    res.render("student/student-home", { studentDeatail });
  } else {
    console.log("login page");
    res.render("student/student-login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});
router.post("/student-login", function (req, res, next) {
  studentHelpers.doLogin(req.body).then((response) => {
    console.log(response);
    if (response.status) {
      req.session.studentLoggedIn = true;
      req.session.student = response.student;
      console.log("Entering to Student Home");
      console.log(req.session.student);
      let studentDeatail = req.session.student;
      res.render("student/student-home", { studentDeatail });
    } else {
      req.session.loginErr = true;
      res.redirect("student-login");
    }
  });
});
router.post("student/student-signup", (req, res) => {
  studentHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    res.render("/student/student-login");
  });
});
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.render("index");
});
router.get("/student-home", async (req, res) => {
  if (req.session.studentLoggedIn) {
    let student = req.session.student;
    let announcement=await tutorHelpers.getAnnouncements()
    console.log(student);
    console.log(notification);
    res.render("student/student-home", { student, notification,announcement });
  } else {
    res.render("student/student-login");
  }
});
router.get("/student-signup", function (req, res, next) {
  console.log("login page");
  res.render("student/student-signup");
});
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.render("index");
});
router.get("/student/student-login", function (req, res, next) {
  if (req.session.studentLoggedIn) {
    console.log("not logged");
    res.render("student/view-teachers");
  } else {
    console.log("not logged in as student");
    res.render("student/student-login");
  }
});
router.get("/tutor/view-teachers", (req, res) => {
  res.render("student/view-teachers");
});
router.get("/otp-login", (req, res) => {
  if (req.session.studentLoggedIn) {
    res.redirect("/student/student-home");
  } else {
    res.render("student/otp-login", {
      emailError: req.session.loginErr,
      otpError: req.session.otpError,
    });
    req.session.loginErr = false;
    req.session.otpError = false;
  }
});
var email;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "casper.mcclure@ethereal.email",
    pass: "DTefu7T3jUkSfRYRdD",
  },
});

router.post("/otp-login", async (req, res) => {
  studentHelpers.findEmail(req.body.studentmail).then((response) => {
    if (response.status) {
      // email = req.body.studentmail;
      // var mailOptions = {
      //   to: req.body.studentmail,
      //   subject: "OTP - Class Room Management System ",
      //   html:
      //     "<h3>OTP for account verification is </h3>" +
      //     "<h1 style='font-weight:bold;'>" +
      //     otp +
      //     "</h1>", // html body
      // };
      // transporter.sendMail(mailOptions, (error, info) => {}
      //   if (error) {
      //     return console.log(error);
      //   }
      //   console.log("Message sent: %s", info.messageId);
      //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
        res.render("student/verify-otp");
      // });
     } else {
       req.session.loginErr = true;
       res.redirect("/student/otp-login");
     }
  })
});
router.get("/verify-otp", (req, res) => {
  if (req.session.studentLoggedIn) {
    res.redirect("/student/student-home");
  } else {
    res.render("student/verify-otp");
  }
});
router.post("/verify-otp", (req, res) => {
  if (req.body.otp == otp) {
    req.session.studentLoggedIn = true;
    res.render("student/student-home");
  } else {
    req.session.otpError = true;
    res.redirect("/student/otp-login");
  }
});
router.get("/assignments/:id", (req, res) => {
  let student = tutorHelpers.getStudentDetails(req.params.id);
  tutorHelpers.getAssignments().then((all_assignments) => {
    let studentdeatail = req.session.student;
    res.render("student/assignments", { all_assignments, studentdeatail });
  });
});
router.post("/assignments/:id", verifyLogin, (req, res) => {
  studentHelpers.submitAssignment(req.body.topic, req.params.id).then(() => {
    if (req.files.assignment) {
      let assignment = req.files.assignment;
      let id = req.params.id;
      notification.student = false;
      let topic = req.body.topic;
      assignment.mv(
        "./public/data/student-assignment/" + id + topic + ".pdf",
        (err) => {
          if (!err) {
            res.redirect("/student/student-home");
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});
router.get("/task-today", async (req, res) => {
  let notes = await tutorHelpers.getNotes();
  notification.attendance = true;
  console.log("student is");
  console.log(notification.attendance);
  tutorHelpers.getAssignments().then((all_assignments, date) => {
    res.render("student/task-today", { all_assignments, date, notes });
  });
});
router.get("/view-notes", async (req, res) => {
  let notes = await tutorHelpers.getNotes();
  res.render("student/view-notes", { notes });
});
router.get("/announcements",async(req,res)=>{
  let announcements=await tutorHelpers.getAnnouncements()
  res.render("student/announcements",{announcements})
})
module.exports = router;
