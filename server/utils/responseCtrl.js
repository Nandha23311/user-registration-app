var HttpStatus = require('../constants');

exports.badRequest=function (res,message){
    res.status(HttpStatus.BAD_REQUEST).json({
        status:"failure",
        code:HttpStatus.BAD_REQUEST,
        error:message
    })
    return;
}
exports.success=function (res,message){
    res.status(HttpStatus.OK).json({
        status:"success",
        code:HttpStatus.OK,
        data:message
    })
    return;
}
exports.InternalError=function (res,message){
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status:"failure",
        code:HttpStatus.INTERNAL_SERVER_ERROR,
        error:message
    })
    return;
}
exports.notFound=function (res,message){
    res.status(HttpStatus.NOT_FOUND).json({
        status:"not found",
        code:HttpStatus.NOT_FOUND,
        error:message
    })
    return;
}
exports.unAuthorized=function (res,message){
    res.status(HttpStatus.UNAUTHORIZED).json({
        status:"failure",
        code:HttpStatus.UNAUTHORIZED,
        error:message
    })
    return;
}
