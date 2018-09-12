const constants = require('../constants')

//Validation Log Function
exports.validationLog=function(msg){
    if(constants.VALIDATION_LOG){
        console.log(msg)
    }
}

//Result Log Function
exports.resultLog=function(msg){
    if(constants.RESULT_LOG){
        console.log(msg)
    }
}