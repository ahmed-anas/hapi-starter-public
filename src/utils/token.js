'use strict';

const jwt = require('jsonwebtoken');
const { jwtSecret, env } = require('../../config/config')
var { ROLES } = require('../db_schemas/user');
const UserModel = require('../modules/user/user.model')
const moment = require('moment')
var TOKEN_TYPE = {
    REGISTERED_USER: 'registered-user',
    NEW_USER: 'new-user',
    RESET_PASSWORD: 'reset-password'
};

var TOKEN_TYPE_COLLECTION = [TOKEN_TYPE.REGISTERED_USER, TOKEN_TYPE.NEW_USER, TOKEN_TYPE.RESET_PASSWORD];

const AdminTokenStorage = [];

module.exports.TOKEN_TYPE = TOKEN_TYPE;


module.exports.createTokenAndStoreHash = async function (data, role, tokenType) {
    var expiryTime = "1h";
    var expiryTimeFormatted = moment().add(1, 'hour')

    if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "qa") {
        expiryTime = "60d";
        expiryTimeFormatted = moment().add(60, 'days')
    }
    else if (process.env.NODE_ENV == "stage") {
        expiryTime = "10d";
        expiryTimeFormatted = moment().add(10, 'days')

    }

    expiryTimeFormatted = expiryTimeFormatted.format('YYYY-MM-DD HH:mm:ss')

    var payload = null;

    payload = getPayloadForRegisteredUser(data, role);



    // Sign the JWT
    let token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256', expiresIn: expiryTime });
    let hash = token.split('.')[2]

    //TODO: implement admin tokens
    if (role !== ROLES.ADMIN) {
        await UserModel.storeToken(data, hash, expiryTimeFormatted)
    }
    else {
        AdminTokenStorage.push(hash);
        if (AdminTokenStorage.length > 50) {
            AdminTokenStorage.shift();
        }
    }
    return token
}

const getPayloadForRegisteredUser = function (data, role) {
    var payload = { id: data.id, role: role, type: TOKEN_TYPE.REGISTERED_USER };

    return payload;
}


const processAuthToken = async function (decoded, request) {

    let token = request.auth.token;
    let hash = token.split('.')[2];
    let isTokenHashExist = decoded.role === ROLES.ADMIN ? AdminTokenStorage.indexOf(hash) >= 0 : await UserModel.checkIfTokenHashExist(decoded.id, hash)

    if (decoded.role === ROLES.ADMIN && env === 'development') {
        isTokenHashExist = true;
    }
    
    if (!isTokenHashExist) {
        return { isValid: false }
    }


    if (!decoded || !decoded.type || !TOKEN_TYPE_COLLECTION.includes(decoded.type) || !decoded.role || (!decoded.id && !decoded.phoneNumber)) {
        return { isValid: false };
    }

    if (decoded.role == ROLES.USER || decoded.role == ROLES.ADMIN) {
        return { isValid: true, credentials: { type: decoded.type, id: decoded.id, scope: decoded.role } };
    }


};


module.exports.processAuthToken = processAuthToken;