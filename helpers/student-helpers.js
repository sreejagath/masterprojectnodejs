var db=require('../config/student-connection');
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
    }
}