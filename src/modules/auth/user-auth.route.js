'use strict';
const UserCtrl = require('./user-auth.controller');
var UserModelConstraints = require('../../db_schemas/user').USER_DATA_CONSTRAINTS;
var ROLES_COLLECTION = require('../../db_schemas/user').ROLES.ALL_ROLES;
var ROLES = require('../../db_schemas/user').ROLES;
const Joi = require('@hapi/joi');
const Boom = require('boom');

exports.routes = {
    name: 'userAuthRoutes',
    version: '1.0.0',
    register: async function (server, options) {


        server.route({
            method: 'POST',
            path: '/auth/signup',
            options: {
                auth: false,
                handler: UserCtrl.signUpUser,
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        email: Joi.string().required().error(new Error('Invalid email')),
                        phoneNumber: Joi.string().regex(UserModelConstraints.PHONE_NUMBER_REGEX).required().error(new Error('Invalid phone number')),
                        fullName: Joi.string().required().min(UserModelConstraints.FULL_NAME_MIN_LENGTH).error(new Error('Invalid full name')),
                        password: Joi.string().required().min(UserModelConstraints.PASSWORD_MIN_LENGTH).error(new Error('Invalid password')),
                        type: Joi.equal('doctor','patient')
                    }),
                    failAction(request, reply, source, error) {
                        return Boom.badRequest(source.message);
                    }

                },
                description: "Register new user."
            }
        });




        server.route({
            method: 'post',
            path: '/auth/signin',
            handler: UserCtrl.signIn,
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        email: Joi.string().required(),
                        password: Joi.string().required()
                    })
                },
                description: "Sign in user"
            }
        });


        

        server.route({
            method: 'post',
            path: '/auth/forgot-password',
            handler: UserCtrl.forgotPassword,
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        email: Joi.string().required(),
                    })
                },
                description: "Forgot Password call"
            }
        });
        server.route({
            method: 'post',
            path: '/auth/forgot-password/recover',
            handler: UserCtrl.forgotPasswordRecover,
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        newPassword: Joi.string().required(),
                        token: Joi.string().required(),
                        userId: Joi.number().required(),
                    })
                },
                description: "Forgot Password call"
            }
        });

        server.route({
            method: 'POST',
            path: '/admin/auth/signin',
            handler: UserCtrl.signInAdmin,
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email({ minDomainSegments: 2 }).required(),
                        password: Joi.string().required()
                    })
                },
                description: "Sign in admin"
            }
        });
        


    }
};
