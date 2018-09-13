const thisCtrl =this;
const constants = require('../constants')

//INTEGER VALIDATION
exports.isInteger = (data)=>{
    if(Number.isInteger (data)) return true ;
    else false ;
}
exports.isFinite = (data)=>{
    if(Number.isFinite (data)) return true ;
    else false ;
}
exports.isNaN = (data)=>{
    if(Number.isNaN (data)) return true ;
    else false  ;
}
exports.stringCmp = (str1,str2)=>{
    if(str1.toString() === str2.toString()) return true ;
    else false  ;
}


//OBJECT VALIDATION
exports.objectIsEmpty = (object) =>{
    if( Object.keys(object).length == 0 ) return true;
    else false ;
}
exports.objectisValid = (object,mandatorykeys) =>{
    let tempObj = {} ;
    for(let eachKey in mandatorykeys){
        if(mandatorykeys[eachKey]&& ( !object[eachKey] && object[eachKey] ==null ) ){
            tempObj[ eachKey ] = object[eachKey]
        }
    }
    return tempObj;
}

//CredentialValidation
exports.userNameValidation =function(userName){
    userName = userName.toString().trim();
    if(userName.length >= constants.USERNAME_LENGTH_MIN && userName.length < constants.USERNAME_LENGTH_MAX){
        return true
    }
    return false
}
exports.passwordValidation =function(password){
    password = password.toString().trim();
    if(password.length >= constants.PASSWORD_LENGTH_MIN && password.length < constants.PASSWORD_LENGTH_MAX ){        
        return true        
    }
    return false
}
exports.mobileNumberValidation =function(mobileNumber){    
    if(thisCtrl.isInteger(mobileNumber) && mobileNumber.toString().length == constants.MOBILE_NUMBER_LENGTH){
        return true
    }
    return false
}
exports.passwordStrength= function(string){    
    var number=/[0-9]/g;
    var special=/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    var alphabet=/[a-z]/gi;
    var numberLength=0;
    var alphabetLength=0;
    var specialLength=0;
    var score=0;
    var temp_score=0;
    string = string.toString().trim();
    if(string.match(number)){
        numberLength=string.match(number).length;
    }
    if(string.match(alphabet)){
        alphabetLength=string.match(alphabet).length;
    }
    if(string.match(special)){
        specialLength=string.match(special).length;
    }
    
    temp_score = numberLength >= 3 ? 3 : numberLength < 2 ? numberLength ==0 ? 0: 1 : 2 
    score = score + temp_score;
    
    temp_score = specialLength >= 3 ? 3 : specialLength < 2 ? specialLength ==0 ? 0: 1 : 2 
    score = score + temp_score;
    
    temp_score = alphabetLength >= 6 ? 4 : alphabetLength < 4 ? alphabetLength ==0 ? 0: 1 : 4
    score = score + temp_score;
    
    return score >=9 ? "Strong" : score >=6 ? "Average" : "Weak"  //>=9 Strong , 9> or <=6 Average , 6> Weak
}