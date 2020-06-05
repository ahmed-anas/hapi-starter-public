'use strict';
const ROLES = require('../../db_schemas/user').ROLES
const Joi = require('@hapi/joi')
const mediaController = require('./media.controller');
const MediaHelper = require('../../libs/media.helper')

exports.routes = {
    name: 'Media Routes',
    version: '1.0.0',
    register: async function (server, options) {

        server.route({
            method: 'GET',
            path: '/media/signed-url',
            handler: mediaController.createSignedUrl,
            options: {
                validate: {
                    query: Joi.object({
                        extension: Joi.equal(...MediaHelper.ALLOWED_EXTENSIONS).description('extension of file to upload').required()
                    })
                },
                tags: ['api'],
                auth: {
                    strategy: 'jwt',
                    scope: [ROLES.USER, ROLES.ADMIN]
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