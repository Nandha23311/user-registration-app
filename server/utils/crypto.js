//Crypto
const crypto = require('crypto');
const constants =require('../constants')

exports.encrypt=(text)=>{        
    const cipher = crypto.createCipher(constants.CRYPTO_ALGORITHM, constants.CRYPTO_KEY);  
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');     
}
exports.decrypt=(encrypted_text)=>{        
    const decipher = crypto.createDecipher(constants.CRYPTO_ALGORITHM, constants.CRYPTO_KEY);  
    return decipher.update(encrypted_text, 'hex', 'utf8') + decipher.final('utf8');
}
exports.generateToken=()=>{            
    return crypto.randomBytes(16).toString("hex");
}
