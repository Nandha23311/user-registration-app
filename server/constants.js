module.exports = {
    //Utils Constants
    VALIDATION_LOG: true,
    RESULT_LOG: true,    
    CRYPTO_ALGORITHM: 'aes256',
    CRYPTO_KEY: 'lockandkey',

    //Validation_Constants
    USERNAME_LENGTH: 6,
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
    
    //Mongo Constants
    MONGO_DUPLICATE_CODE:11000
}