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
                    username:tutorUpdate.username
                }
            }).then((response)=>{
                resolve()
        })
        })
    }
}