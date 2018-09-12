var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({    
    userName: {type: String,required:true,unique:true},
    password: {type: String,required:true},
    firstName:{type: String},
    lastName:{type: String},    
    age:{type:Number},
    mobileNumber: {type: Number, unique:true},    
    token:{type: String},
    verifiedStatus:{type:Boolean,default:false},    
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('user', userSchema);
