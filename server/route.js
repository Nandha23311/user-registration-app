const User=require('./models/User')
const UserCtrl=require('./controller/UserController')
const responseCtrl=require('./utils/responseCtrl')

module.exports = function(router){	
	function authFunction(req,res,next){ //Authentication Function				
		if(req.headers.mobile){ //For Mobile Authentication
			return findToken() 
		}else{ //For Web Authentication, like a session handling							
			return findToken() 
		}
		
		function findToken(){
			User.findOne({token:req.headers.token},(findErr,userData)=>{
				if(findErr){                
					return responseCtrl.InternalError(res,"unexpected error accessing data")
				}
				if(userData != null){                                                                     
					return next() 
				}
				return responseCtrl.unAuthorized(res,"You must login first!")
			})        
		}		
	}

	router.post('/api/user/savenewuser',UserCtrl.saveNewUser)
	router.post('/api/user/userlogin',UserCtrl.userLogin)
	router.post('/api/user/getuserprofile',authFunction,UserCtrl.getUserProfile)
	router.post('/api/user/updateuser',authFunction,UserCtrl.updateUser)
};