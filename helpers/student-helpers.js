var db=require('../config/connection');
var collection=require('../config/collection');
const { ObjectId } = require('mongodb');
const bcrypt=require('bcrypt');
module.exports={
    doSignup:(studentData)=>{
        return new Promise(async(resolve,reject)=>{
            studentData.password=await bcrypt.hash(studentData.password,10)
        db.get().collection(collection.STUDENT_COLLECTION).insertOne(studentData).then((data)=>{
            resolve(data.ops[0]._id)
        })
        })
    },
    doLogin:(studentData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let student=await db.get().collection(collection.STUDENT_COLLECTION).findOne({username:studentData.username})
            if(student){
                bcrypt.compare(studentData.password,student.password).then((status)=>{
                    if(status){
                        console.log("Login Success")
                        response.student=student
                        console.log("Detail is here");
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
    getStudentDetails:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.STUDENT_COLLECTION).findOne({_id:ObjectId(id)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getStudents:()=>{
        return new Promise(async(resolve,reject)=>{
            let studentslist=await db.get().collection(collection.STUDENT_COLLECTION).find().toArray()
            resolve(studentslist)
        })
    },
    findEmail:(email)=>{
        return new Promise(async(resolve,reject)=>{
            let emailstatus=false;
            let response={};
            let studentpresent=await db.get().collection(collection.STUDENT_COLLECTION).findOne({studentmail:email})
           if(studentpresent){
               
               console.log("hello");
               response.email=studentpresent;
               response.status=true;
               resolve(response)
            console.log(resolve);
            console.log(studentpresent);
          }else{
              console.log("email not found");
              resolve({status:false})
          }
          
        })
    
    },
    submitAssignment:(content)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.ASSIGNMENT_UPLOAD).insertOne(content).then((data)=>{
                resolve(data.ops[0].topic)
            })
        })
    }
}
