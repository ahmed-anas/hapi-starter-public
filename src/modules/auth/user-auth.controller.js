const Boom = require('boom');

const models = require('../../db_schemas');
const UserAuthModel = require('./user-auth.model');
const crypto = require('crypto');
var ROLES = require('../../db_schemas/user').ROLES;

const tokenHelper = require('../../utils/token');
const hash_helper = require('../../utils/hashpwd');


exports.forgotPassword = async (req, h) => {
    throw new Error('to be implemented');

    //create a uuid v4 + v6 token
    //place it into the UserTokens with type forgot password 
    //send email to given email address with the token
    //see email.js in libs folder  for function which can send email
}


exports.forgotPasswordRecover = async (req, h) => {
    throw new Error('to be implemented');

    //check to see if userId and token exists in UserTokens table with type forgot password
    //set password to new password if it does

}
exports.signIn = async (req, h) => {
    try {
        var userData = req.payload;
        let role = ROLES.USER
        const user = await models.Users.findOne({
            where: {
                email: userData.email
            }
        });

        if (!user || user.password !== hash_helper.hashPassword(userData.password, user.salt)) {
            return Boom.badRequest("Invalid phone and password combination");
        }


        var userObj = {
            id: user.id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: role
        };


        let token = await tokenHelper.createTokenAndStoreHash({
            id: user.id,
        }, role, tokenHelper.TOKEN_TYPE.REGISTERED_USER)

        return {
            token: token,
            user: userObj
        };
    }
    catch (err) {
        return Boom.badRequest(err);
    }
}


exports.signUpUser = async (req, h) => {
    try {
        var data = req.payload;
        data.role = ROLES.USER
        var user = await UserAuthModel.createUser(data);
        if (user) {

            var userObj = {
                id: user.id,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                role: data.role,
                type: data.type
            };
            let token = await tokenHelper.createTokenAndStoreHash(user, data.role, tokenHelper.TOKEN_TYPE.REGISTERED_USER)
            return { token: token, user: userObj };

        }
    }
    catch (err) {
        return Boom.badRequest(err);
    }
}


// Admin - START

exports.signInAdmin = async (req, h) => {
    try {
        var userData = req.payload;

        const user = await models.Admins.findOne({
            where: {
                email: userData.email
            }
        });

        if (!user || user.password !== hash_helper.hashPassword(userData.password, user.salt)) {
            return Boom.badRequest("Invalid email and password combination");
        }

        let role = ROLES.ADMIN
        let token = await tokenHelper.createTokenAndStoreHash(user, role, tokenHelper.TOKEN_TYPE.REGISTERED_USER)
        return { token: token, user: { id: user.id, email: user.email, role: role } };
    }
    catch (err) {
        return Boom.badRequest(err);
    }
}

// Admin - END