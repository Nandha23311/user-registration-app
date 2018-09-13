module.exports = {

    //Utils Constants
    VALIDATION_LOG: true,
    RESULT_LOG: true,    
    CRYPTO_ALGORITHM: 'aes256',
    CRYPTO_KEY: 'lockandkey',

    //Validation_Constants
    USERNAME_LENGTH_MIN: 6,
    USERNAME_LENGTH_MAX: 20,
    PASSWORD_LENGTH_MIN: 6,
    PASSWORD_LENGTH_MAX: 20,
    MOBILE_NUMBER_LENGTH: 10,
    
    //Http-Status
    OK: 200,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,

    //Response_Constants
    SAVE_SUCCESS:'Userdata has been added succesfully',
    UPDATE_SUCCESS:'Userdata has been updated succesfully',
    USER_NOTFOUND:'User not found',
    ERROR_WHILE_FINDING:'Error while finding data',
    ERROR_WHILE_SAVING:'Error while saving data',
    ERROR_WHILE_UPDATING:'Error while updating data',    
    PASSWORD_INVALID_STRING:"Password length should be between "+6+" and "+20,
    OLD_PASSWORD_INVALID_STRING:"Current Password length should be between "+6+" and "+20,
    NEW_PASSWORD_INVALID_STRING:"New Password length should be between "+6+" and "+20,
    USERNAME_INVALID_STRING:"Username length should be between "+6+" and "+20,
    INVALID_MOBILE_NUMBER:"Invalid Mobile Number",
    INVALID_USER_ID:"Invalid User Id",
    USERNAME_ALREADY_EXISTS:"Username already exists",
    MOBILENUMBER_ALREADY_EXISTS:"Mobilenumber already exists",
    PASSWORD_NOT_MATCH:"Your Password is incorrect",
    OLD_PASSWORD:"Current password is incorrect",
    OLD_PASSWORD_ISEMPTY:"Current password does not exists",
    
    //Mongo Constants
    MONGO_DUPLICATE_CODE:11000
}