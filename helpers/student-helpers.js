var db=require('../config/connection');
var collection=require('../config/collection');
const bcrypt=require('bcrypt');
module.exports={
    doSignup:(studentData)=>{
        return new Promise(async(resolve,reject)=>{
            studentData.password=await bcrypt.hash(studentData.password,10)
        db.get().collection(collection.STUDENT_COLLECTION).insertOne(studentData).then((data)=>{
            resolve(data.ops[0])
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
    getStudents:()=>{
        return new Promise(async(resolve,reject)=>{
            let studentslist=await db.get().collection(collection.STUDENT_COLLECTION).find().toArray()
            resolve(studentslist)
        })
    },
    findEmail:(email)=>{
        return new Promise(async(resolve,reject)=>{
            let studentpresent=await db.get().collection(collection.STUDENT_COLLECTION).findOne({studentmail:email})
           if(studentpresent){
               resolve(studentpresent)
               console.log("hello");
            console.log(resolve);
            console.log(studentpresent);
          }else{
              reject()
          }
          
        })
    
    }
}
