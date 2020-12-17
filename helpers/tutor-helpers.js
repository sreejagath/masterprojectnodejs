var db=require('../config/connection');
var collection=require('../config/collection');
const bcrypt=require('bcrypt');
const { response } = require('express');
const { ObjectId } = require('mongodb');

module.exports={
    doSignup:(tutorData)=>{
        return new Promise(async(resolve,reject)=>{
            tutorData.password=await bcrypt.hash(tutorData.password,10)
        db.get().collection(collection.TUTOR_COLLECTION).insertOne(tutorData).then((data)=>{
            resolve(data.ops[0])
        })
        })
    },
    doLogin:(tutorData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let tutor=await db.get().collection(collection.TUTOR_COLLECTION).findOne({username:tutorData.username})
            if(tutor){
                bcrypt.compare(tutorData.password,tutor.password).then((status)=>{
                    if(status){
                        console.log("Login Success")
                        response.tutor=tutor
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("Login Failed")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("Login Failed")
                resolve({status:false})
            }
        })
    },
    getTutorDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let tutordetails=await db.get().collection(collection.TUTOR_COLLECTION).find().toArray()
            resolve(tutordetails)
        })
    },
    updateDetails:(tid,tutorUpdate)=>{
        return new Promise(async(resolve,reject)=>{
           
            db.get().collection(collection.TUTOR_COLLECTION).updateOne({_id:ObjectId(tid)},{
                $set:{
                    tutorname:tutorUpdate.tutorname,
                    tutorphone:tutorUpdate.tutorphone,
                    tutormail:tutorUpdate.tutormail,
                    tutorcourse:tutorUpdate.tutorcourse,
                    dob:tutorUpdate.dob,
                    username:tutorUpdate.username,
                    
                }
            }).then((response)=>{
                resolve()
        })
        })
    },
    getStudentDetails:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.STUDENT_COLLECTION).findOne({_id:ObjectId(id)}).then((response)=>{
                resolve(response)
            })
        })
    },
    updateStudent:(sid,studentData)=>{
        return new Promise(async(resolve,reject)=>{
            studentData.password=await bcrypt.hash(studentData.password,10)
            db.get().collection(collection.STUDENT_COLLECTION).updateOne({_id:ObjectId(sid)},{
                $set:{
                    studentname:studentData.studentname,
                    studentphone:studentData.studentphone,
                    studentcourse:studentData.studentcourse,
                    studentmail:studentData.studentmail,
                    studentdob:studentData.studentdob,
                    rollnumber:studentData.rollnumber,
                    password:studentData.password
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    deleteStudent:(studentid)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.STUDENT_COLLECTION).removeOne({_id:ObjectId(studentid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    addAssignments:(assignmentdetails)=>{
        return new Promise(async(resolve,reject)=>{
            var datetime = new Date();
             
        db.get().collection(collection.ASSIGNMENT_DATA).insertOne(assignmentdetails).then((data)=>{
            resolve(data.ops[0].topic)
            console.log(datetime);
        })
        })
    },
    getAssignments:()=>{
        return new Promise(async(resolve,reject)=>{
            let all_assignments=await db.get().collection(collection.ASSIGNMENT_DATA).find().toArray()
            resolve(all_assignments)
            console.log(all_assignments);
        })
    },
    deleteAssignment:(assignmentid)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.ASSIGNMENT_DATA).removeOne({_id:ObjectId(assignmentid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getStudentAssignment:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let student_assignments=await db.get().collection(collection.ASSIGNMENT_UPLOAD).find().toArray()
                resolve(student_assignments)
        })
    },
    studentAssignment:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let assignList=await db.get().collection(collection.STUDENT_COLLECTION).aggregate([
                {
                    $match:{_id:ObjectId(userId)}
                },{
                    $unwind:'$topic'
                },
                 {
                     $lookup:{
                         from:collection.STUDENT_COLLECTION,
                         localField:'topic',
                         foreignField:'id', 
                         as:'assignments'
                     }
                 },
                 {
                     $project:{
                       
                         topic:'$assignments'
                     }
                 },
                 {
                     $project:{
                         topic:1
                     }
                    }
                //  ,{
                //      $unwind:'$topic'
                //  }
                  
                //   {
                //     $project:{
                //          assignments:1
                //       }
                //   },
                 
                
            ]).toArray()
            console.log("id is");
            //console.log(assignList[0])
            console.log("assignments are");
            console.log(assignList[0]);
            console.log("hello");
            resolve(assignList)
        })

    },
    addNotes:(notesdetails)=>{
        return new Promise(async(resolve,reject)=>{
        db.get().collection(collection.NOTES).insert(notesdetails).then((data)=>{
            resolve(data.ops[0])
        })
        })
    },
    getNotes:()=>{
        return new Promise(async(resolve,reject)=>{
            let all_notes=await db.get().collection(collection.NOTES).find().toArray()
            resolve(all_notes)
        })
    },
    deleteNotes:(notesid)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.NOTES).removeOne({_id:ObjectId(notesid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    addAnnouncements:(announcement)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ANNOUNCEMENTS).insertOne(announcement).then((data)=>{
                resolve(data)
                console.log(datetime);
            })
        })
    },
    getAnnouncements:()=>{
        return new Promise(async(resolve,reject)=>{
            let announcements=await db.get().collection(collection.ANNOUNCEMENTS).find().toArray()
            resolve(announcements)
            console.log(announcements);
        })
    }
   
}