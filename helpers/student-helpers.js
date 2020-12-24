var db = require("../config/connection");
var collection = require("../config/collection");
var ObjectId = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
module.exports = {
  doSignup: (studentData) => {
    return new Promise(async (resolve, reject) => {
      studentData.password = await bcrypt.hash(studentData.password, 10);
      db.get()
        .collection(collection.STUDENT_COLLECTION)
        .insertOne(studentData)
        .then((data) => {
          resolve(data.ops[0]._id);
        });
    });
  },
  doLogin: (studentData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let student = await db
        .get()
        .collection(collection.STUDENT_COLLECTION)
        .findOne({ username: studentData.username });
      if (student) {
        bcrypt
          .compare(studentData.password, student.password)
          .then((status) => {
            if (status) {
              console.log("Login Success");
              response.student = student;
              console.log("Detail is here");
              response.status = true;
              resolve(response);
            } else {
              console.log("Login Failed");
              resolve({ status: false });
            }
          });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },
  getStudentDetails: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.STUDENT_COLLECTION)
        .findOne({ _id: ObjectId(id) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  getStudents: () => {
    return new Promise(async (resolve, reject) => {
      let studentslist = await db
        .get()
        .collection(collection.STUDENT_COLLECTION)
        .find()
        .toArray();
      resolve(studentslist);
    });
  },
  findPhone: (phone) => {
    return new Promise(async (resolve, reject) => {
      let phonestatus = false;
      let response = {};
      let studentpresent = await db
        .get()
        .collection(collection.STUDENT_COLLECTION)
        .findOne({ studentphone: phone });
      if (studentpresent) {
        console.log("hello");
        response.phone = studentpresent;
        response.status = true;
        resolve(response);
        console.log(resolve);
        console.log(studentpresent);
      } else {
        console.log("Phone not found");
        resolve({ status: false });
      }
    });
  },
  submitAssignment: (content, studentId) => {
    return new Promise(async (resolve, reject) => {
      let assignmentList = await db
        .get()
        .collection(collection.STUDENT_COLLECTION)
        .findOne({ _id: ObjectId(studentId) });
      if (assignmentList) {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        // current year
        let year = date_ob.getFullYear();

        // current hours
        let hours = date_ob.getHours();

        // current minutes
        let minutes = date_ob.getMinutes();

        // prints date in YYYY-MM-DD format
        console.log(year + "-" + month + "-" + date);

        // prints date & time in YYYY-MM-DD HH:MM:SS format
        let timestamp =
          date + "/" + month + "/" + year + "," + hours + ":" + minutes;
        let assignments = {
          id: ObjectId(studentId),
          topic: content,
          date: timestamp,
        };
        db.get()
          .collection(collection.STUDENT_COLLECTION)
          .updateOne(
            { _id: ObjectId(studentId) },
            {
              $push: {
                assignments,
              },
            }
          )
          .then((response) => {
            resolve();
          });
      }
      // else{
      //     db.get().collection(collection.STUDENT_COLLECTION).updateOne({student:ObjectId(studentId)},
      //     {
      //         $set:{
      //             topic:[content]
      //         }
      //     }).then((response)=>{
      //             resolve()
      //     })
      // }
      // db.get().collection(collection.ASSIGNMENT_UPLOAD).insertOne(content).then((data)=>{
      //     resolve(data.ops[0].topic)
      // })
    });
  },
  addAttendance:(id,attendance)=>{
    return new Promise(async (resolve, reject) => {
      console.log("student:");
      console.log(id);
      if(attendance===true){
        presentstudent="Present";
         }else{
        presentstudent="Absent";
      }
     console.log(attendance,presentstudent);
      let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ _id: ObjectId(id) });
       if (student) {
         let date_ob = new Date();
         let date = ("0" + date_ob.getDate()).slice(-2);
         let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
         let year = date_ob.getFullYear();
         console.log(date + "/" + month + "/" + year);
         let timestamp = date + "/" + month + "/" + year;
         let attendance = {
           id: ObjectId(id),
           status:presentstudent,
           date: timestamp,
         };
         console.log("printing date");
         console.log(attendance.date);
         let dateExist=student.attendance.findIndex(attendance=> attendance.date==timestamp)
         console.log("date is present");
            console.log(dateExist);
           if (dateExist!=-1){
             reject
          //    console.log("present here");
          //                       db.get().collection(collection.STUDENT_COLLECTION).updateOne({ _id: ObjectId(id) },
          //                        {
          //                            reject
          //                          }).then((response) => {
          //                              resolve();
          //                             });
           }else{
            console.log("not present");
            // let attendance = {
            //   id: ObjectId(id),
            //   status:presentstudent,
            //   date: timestamp,
            // };
                    db.get().collection(collection.STUDENT_COLLECTION).updateOne({ _id: ObjectId(id) },
                     {
                     $push: {
                     attendance,
                    }
                    }).then((response) => {
                   resolve();
                     });
                   }
                 }
      })
  },
  getEventDetails:(id)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.EVENTS).findOne({_id:ObjectId(id)}).then((response)=>{
            resolve(response)
        })
    })
}  

};
