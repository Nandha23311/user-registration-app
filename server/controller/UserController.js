const User=require('../models/User');
const responseCtrl=require('../utils/responseCtrl')
const validationCtrl=require('../utils/validation')
const crypto=require('../utils/crypto')
const constants =require('../constants')
const thisCtrl = this;

exports.saveNewUser = (req,res) =>{
    let reqBody=req.body;
    if(reqBody.userName && reqBody.password){ //userName & password is Mandatory
        if(reqBody.userName.length >= constants.USERNAME_LENGTH){
            return thisCtrl.findUser({userName:reqBody.userName.toString().toLowerCase()}, res, callBack) //findUserByUsername           
        }
        return responseCtrl.badRequest(res,"Username must contains atleast "+constants.MOBILE_NUMBER_LENGTH+" letters")
    }else{
        return thisCtrl.mandatoryCheckFailed(reqBody, res)
    }
    
    function callBack(userData){      
        if(userData === null)  {            
            return createNewUser()                         
        }    
        return responseCtrl.badRequest(res,"Username already exists")
    }            
    
    function createNewUser(){
        let userObj = {};
        if(reqBody.mobileNumber){ //if mobile number exists validate the otherwise save record without mobilenumber
            if(validationCtrl.isInteger(reqBody.mobileNumber) && reqBody.mobileNumber.toString().length == constants.MOBILE_NUMBER_LENGTH){                        
                userObj.mobileNumber = reqBody.mobileNumber
            }else{
                return responseCtrl.badRequest(res,"Invalid Mobilenumber")
            }
        }                        
        userObj.userName = reqBody.userName.toString().toLowerCase()        
        userObj.password = crypto.encrypt(reqBody.password) //to encrypt password
        
        if ( reqBody.firstName ) userObj.firstName = reqBody.firstName
        if ( reqBody.lastName ) userObj.lastName = reqBody.lastName
        
        userObj.token = crypto.generateToken() //to generate token
        let saveUser = new User(userObj) ;      
        return saveUser.save((saveErr, savedUser)=>{ 
            if(saveErr){                                        
                if(saveErr.code == constants.MONGO_DUPLICATE_CODE) {
                    return responseCtrl.InternalError(res,"Mobile number already registered")
                }
                return responseCtrl.InternalError(res,constants.ERROR_WHILE_SAVING)
            }                            
            return responseCtrl.success(res,{ userId: savedUser._id,token: savedUser.token})
        })
    }        
}

exports.userLogin = (req,res)=>{
    let reqBody=req.body;    
    if( reqBody.userName && reqBody.password ){ //userName & password is Mandatory
        return thisCtrl.findUser({userName:reqBody.userName.toString().toLowerCase()}, res, callBack)              
    }else{
        return thisCtrl.mandatoryCheckFailed(reqBody, res)
    }
    function callBack(userData){
        if(userData != null){
            if(userData.password === crypto.encrypt(reqBody.password)){                    
                return responseCtrl.success(res,{ userId: userData._id,token: userData.token})                
            }
            return responseCtrl.badRequest(res,"password did't match")                                
        }
        return responseCtrl.notFound(res,constants.USER_NOTFOUND)     
    }        
}

exports.getUserProfile = (req,res)=>{
    let reqBody =req.body;
    if(reqBody.userId){
        return thisCtrl.getUserById(reqBody.userId,{userName:1,firstName:1,lastName:1,age:1,mobileNumber:1,verifiedStatus:1}).then((user)=>{
            if(user === null){
                return responseCtrl.badRequest(res,constants.ERROR_WHILE_FINDING)
            }
            else if(user === 404){
                return responseCtrl.notFound(res,constants.USER_NOTFOUND)
            }else{
                return responseCtrl.success(res,user)
            }
        })
    }
    return responseCtrl.badRequest(res,"Invalid userId")
}

exports.updateUser = (req,res)=>{
    let reqBody =req.body;    
    if(reqBody.userId){
        return User.findById(reqBody.userId,(findErr,userData)=>{
            if(findErr){                
                return responseCtrl.badRequest(res,constants.ERROR_WHILE_FINDING)
            }
            if(userData != null){  
                let updateObj = reqBody.updateObj;
                for(let eachKey in updateObj){
                    if(updateObj[eachKey]){
                        userData[eachKey] = updateObj[eachKey]
                    } 
                }
                userData.updatedAt=new Date();
                return userData.save((updateErr,updatedUser)=>{
                    if(updateErr){
                        return responseCtrl.badRequest(res,constants.ERROR_WHILE_UPDATING)
                    }                    
                    return responseCtrl.success(res,constants.UPDATE_SUCCESS)
                })

            }            
            return responseCtrl.notFound(res,constants.USER_NOTFOUND)
        })        
    }
    return responseCtrl.badRequest(res,"Invalid userId")
}

exports.getUserById = (userId,project_key)=>{
    return new Promise((resolve)=>{
        User.findById(userId,project_key,(findErr,userData)=>{
            if(findErr){                
                resolve(null)
            }
            if(userData != null){ 
                resolve(userData)
            }            
            resolve(404)
        })        
    })
}
exports.findUser = (findObj ,res ,callback)=>{    
    User.findOne(findObj,(findErr,userData)=>{
        if(findErr){                
            return responseCtrl.InternalError(res,constants.ERROR_WHILE_FINDING)
        }
        if(userData === null){ 
            return callback(null)               
        }else{
            return callback(userData)
        }            
    })                    
}
exports.mandatoryCheckFailed = (reqBody, res) =>{    
    let validationResult = validationCtrl.objectisValid(reqBody,{ userName:true ,password:true})
    let finalString=[];
    Object.keys(validationResult).forEach((eachKey,index) =>{
        finalString[index]  =  `** ${eachKey} is mandatory **`
    })
    return responseCtrl.badRequest(res,finalString)    
}