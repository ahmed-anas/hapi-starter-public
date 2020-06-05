const crypto = require('crypto');

function hashPassword(password, salt) {
    if(salt){
        return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'sha512').toString('base64');
    }
    else{
        return password;
    }
}
module.exports.hashPassword = hashPassword;

exports.setPassword = async function (user) {
    if (user.password) {
        user.salt = crypto.randomBytes(16).toString('base64');
        user.password = hashPassword(user.password, user.salt);
        return Promise.resolve(user);
    }
    else {
        return Promise.reject("Password is required");
    }
}

exports.generatePassword = function () {
    return crypto.randomBytes(6).toString('base64');
}