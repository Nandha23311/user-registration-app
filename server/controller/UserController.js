const User=require('../models/User');
const responseCtrl=require('../utils/responseCtrl')
const validationCtrl=require('../utils/validation')
const crypto=require('../utils/crypto')
const constants =require('../constants')
const thisCtrl = this;

exports.saveNewUser = (req,res) =>{
    let reqBody=req.body;
    if(reqBody.userName && reqBody.password){ //userName & password is Mandatory        
        if(validationCtrl.userNameValidation(reqBody.userName)){ //to validate username  
            if(validationCtrl.passwordValidation(reqBody.password)){ //to validate Password                            
                return thisCtrl.findUser({userName:reqBody.userName.toString().trim().toLowerCase()}, res, callBack) //findUserByUsername           
            }else{
                return responseCtrl.badRequest(res,constants.PASSWORD_INVALID_STRING)
            }                                       
        }else{
            return responseCtrl.badRequest(res,constants.USERNAME_INVALID_STRING)
        }        
    }else{
        return thisCtrl.mandatoryCheckFailed(reqBody, res)
    }
    
    function callBack(userData){      
        if(userData === null)  {            
            return createNewUser()                         
        }    
        return responseCtrl.badRequest(res,constants.USERNAME_ALREADY_EXISTS)
    }            
    
    function createNewUser(){
        let userObj = {};
        if(reqBody.mobileNumber && validationCtrl.mobileNumberValidation(reqBody.mobileNumber)){ //to validate mobilenumber            
            userObj.mobileNumber = reqBody.mobileNumber            
        }else{
            return responseCtrl.badRequest(res,constants.INVALID_MOBILE_NUMBER)
        }       

        if(validationCtrl.passwordValidation(reqBody.password)){ //to validate Password            
            userObj.password = crypto.encrypt(reqBody.password.toString().trim()) //to encrypt password
            userObj.passwordStrength = validationCtrl.passwordStrength(reqBody.password.toString().trim()) //to generate password strength
        }else{
            return responseCtrl.badRequest(res,constants.PASSWORD_INVALID_STRING)
        }                           
        userObj.password = crypto.encrypt(reqBody.password.toString().trim()) //to encrypt password
        userObj.passwordStrength = validationCtrl.passwordStrength(reqBody.password) //to generate password strength
        userObj.userName = reqBody.userName.toString().trim().toLowerCase()                
        userObj.token = crypto.generateToken() //to generate token
        
        if ( reqBody.firstName && reqBody.firstName.toString().length !=0 ) userObj.firstName = reqBody.firstName.toString().trim()
        if ( reqBody.lastName && reqBody.lastName.toString().length !=0) userObj.lastName = reqBody.lastName.toString().trim()
                
        let saveUser = new User(userObj) ;      
        return saveUser.save((saveErr, savedUser)=>{ 
            if(saveErr){                                        
                if(saveErr.code == constants.MONGO_DUPLICATE_CODE) {
                    return responseCtrl.InternalError(res,constants.MOBILENUMBER_ALREADY_EXISTS)
                }
                return responseCtrl.InternalError(res,constants.ERROR_WHILE_SAVING)
            }                            
            return responseCtrl.success(res,{ userId: savedUser._id,token: savedUser.token})
        })
    }        
}

exports.userLogin = (req,res)=>{
    let reqBody=req.body;    

    if(reqBody.userName && reqBody.password){ 
        if(validationCtrl.userNameValidation(reqBody.userName)){ 
            if(validationCtrl.passwordValidation(reqBody.password)){ 
                return thisCtrl.findUser({userName:reqBody.userName.toString().trim().toLowerCase()}, res, callBack) 
            }else{
                return responseCtrl.badRequest(res,constants.PASSWORD_INVALID_STRING)
            }                                       
        }else{
            return responseCtrl.badRequest(res,constants.USERNAME_INVALID_STRING)
        }        
    }else{
        return thisCtrl.mandatoryCheckFailed(reqBody, res)
    }    

    function callBack(userData){
        if(userData != null){
            if(userData.password === crypto.encrypt(reqBody.password.toString().trim())){                    
                return responseCtrl.success(res,{ userId: userData._id,token: userData.token})                
            }
            return responseCtrl.badRequest(res,constants.PASSWORD_NOT_MATCH)
        }
        return responseCtrl.notFound(res,constants.USER_NOTFOUND)     
    }        
}

exports.getUserProfile = (req,res)=>{
    let reqBody = req.body;
    if(reqBody.userId){
        return thisCtrl.getUserById(reqBody.userId,{userName:1,firstName:1,lastName:1,age:1,mobileNumber:1,verified:1,passwordStrength:1}).then((user)=>{
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
    return responseCtrl.badRequest(res,constants.INVALID_USER_ID)
}

exports.updateUser = (req,res)=>{
    let reqBody =req.body;    
    if(reqBody.userId){
        return User.findById(reqBody.userId,(findErr,userData)=>{
            if(findErr){                
                return responseCtrl.badRequest(res,constants.ERROR_WHILE_FINDING)
            }
            if(userData != null){                  
                if(reqBody.isResetPassword){ //Check isResetPassword flag for resetpassword
                    if(reqBody.oldPassword){                          
                        if(validationCtrl.passwordValidation(reqBody.oldPassword)){                                 
                            if(crypto.encrypt(reqBody.oldPassword.toString().trim()) === userData.password){                                                        
                                if(validationCtrl.passwordValidation(reqBody.newPassword)){                                    
                                    userData.password = crypto.encrypt(reqBody.newPassword.toString().trim());
                                }else{                                    
                                    return responseCtrl.badRequest(res,constants.NEW_PASSWORD_INVALID_STRING)
                                }                       
                            }else{                                
                                return responseCtrl.badRequest(res,constants.PASSWORD_NOT_MATCH)
                            }
                        }else{
                            return responseCtrl.badRequest(res,constants.OLD_PASSWORD_INVALID_STRING)
                        }                        
                    }else{
                        return responseCtrl.badRequest(res,constants.OLD_PASSWORD_ISEMPTY)  
                    }                    
                }else{ //normal user update
                    if ( reqBody.firstName && reqBody.firstName.toString().length !=0 ) userData.firstName = reqBody.firstName.toString().trim()
                    if ( reqBody.lastName && reqBody.lastName.toString().length !=0) userData.lastName = reqBody.lastName.toString().trim()
                    if ( reqBody.age && reqBody.age > 100 ) userData.age = reqBody.age
                    if (reqBody.mobileNumber){
                        if(validationCtrl.mobileNumberValidation(reqBody.mobileNumber) ){                         
                           userData.mobileNumber = reqBody.mobileNumber
                        }else{
                            return responseCtrl.badRequest(res,constants.INVALID_MOBILE_NUMBER)
                        }
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
    return responseCtrl.badRequest(res,constants.INVALID_USER_ID)
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