'use strict';
const adminCtrl = require('./admin.controller');

const ROLES = require('../../db_schemas/user').ROLES
exports.routes = {
    name: 'Admin Routes',
    version: '1.0.0',
    register: async function (server, options) {
        
        server.route({
            method: 'GET',
            path: '/admin/admin',
            handler: adminCtrl.getAdmins,
            options: {
                auth: {
                    strategy: 'jwt',
                    scope: [ROLES.ADMIN]
                },
                tags: ['api'],
                validate: {
                    
                },
                description: "get all admins"
            }
        });
     
    }
};