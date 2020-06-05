const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const userModel = require('../db_schemas/user');
exports.formatPhoneNumber = function(phoneNumber){
    if(!phoneNumber){
        return null;
    }

    var parsedPhoneNumber = phoneUtil.parse(phoneNumber, 'PK');
    if(parsedPhoneNumber){
        var formattedPhoneNumber = phoneUtil.format(parsedPhoneNumber, PNF.E164);
        return formattedPhoneNumber.toString();
    }
}

exports.isValidPhoneNumber = function(phoneNumber){
    if(!phoneNumber){
        return null
    }

    return userModel.USER_DATA_CONSTRAINTS.PHONE_NUMBER_REGEX.test(phoneNumber);
}