const Boom = require('boom');
const crypto = require('crypto');

const models = require('../../db_schemas');
const UserModel = require('../user/user.model')
const hash_helper = require('../../utils/hashpwd');
const PhoneNumberHelper = require('../../utils/phone-number-helper');

var ROLES = require('../../db_schemas/user').ROLES;

module.exports.createUser = async function (userObj) {
    try {

        // Phone number formatting
        if (userObj.phoneNumber) {
            var formattedPhoneNumber = PhoneNumberHelper.formatPhoneNumber(userObj.phoneNumber);
            if (formattedPhoneNumber) {
                userObj.phoneNumber = formattedPhoneNumber;
            }

            var isUserPhoneNumberExist = await getUserByPhoneNumber(userObj.phoneNumber);
            if (isUserPhoneNumberExist) {
                throw Error('This phone number is already registered with another account. Try logging in or contact support');
            }

            var isUserNameExist = await UserModel.getUserByUserName(userObj.email);
            if(isUserNameExist){
                throw Error('This username already exists')
            }

        }
        else{
            throw Error('Phone number required');
        }

        
        
        var response = null;
        
        
        await hash_helper.setPassword(userObj);
        // var user = {
        //     phoneNumber: userObj.phoneNumber,
        //     password: userObj.password,
        //     salt: userObj.salt,
        //     fullName: userObj.fullName,
        //     email: userObj.email
        // };

        response = await models.Users.create(userObj);
        

        return response;
    }
    catch (err) {
        throw Boom.badRequest(err);
    }
}




const getUserByPhoneNumber = async (phoneNumber) => {
    var existingUser = await models.Users.findOne({
        where: { phoneNumber: phoneNumber }
    });

    return existingUser;
}




