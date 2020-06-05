'use strict';
const UserCtrl = require('./user.controller');
const ROLES = require('../../db_schemas/user').ROLES
const Joi = require('@hapi/joi')
exports.routes = {
    name: 'User Routes',
    version: '1.0.0',
    register: async function (server, options) {

        server.route({
            method: 'get',
            path: '/user',
            handler: UserCtrl.getUser,
            options: {
                tags: ['api'],
                auth: {
                    strategy: 'jwt',
                    scope: [ROLES.USER]
                },
                response: {
                    status: {
                        200: Joi.object(),
                        400: Joi.object({
                            statusCode: Joi.number(),
                            error: Joi.string(),
                            message: Joi.string()
                        })
                    }
                }
            }
        });
    }
};