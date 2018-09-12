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

