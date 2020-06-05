'use strict';
const _ = require('lodash')
const Boom = require('boom');
const pluralize = require('pluralize');
const Sequelize = require('sequelize');
class GenericModel {

    populateDefaultRouteOptions() {

        let defaultRouteOptions = {
            put: {
                method: 'put',
                suffix: ''
            },
            post: {
                method: 'post',
                suffix: ''
            },
            get: {
                method: 'get',
                suffix: ''
            },
            delete: {
                method: 'delete',
                suffix: ''
            },
            count: {
                method: 'get',
                suffix: '/count'
            },
            stats: {
                method: 'get',
                suffix: '/stats'
            },
            bulkPost: {
                method: 'post',
                suffix: '/bulk'
            },
            upsert: {
                method: 'post',
                suffix: '/upsert'
            },
            bulkPut: {
                method: 'put',
                suffix: '/bulk'
            },
            bulkDelete: {
                method: 'delete',
                suffix: '/bulk'
            }
        }


        for (let key in this.options.routeOptions) {
            if (this.options.routeOptions[key] === true) {
                this.options.routeOptions[key] = {};
            }
            if (this.options.routeOptions[key]) {
                this.options.routeOptions[key] = _.extend({}, defaultRouteOptions[key], this.options.routeOptions[key])
            }
        }

    }
    constructor(_model, options) {
        this.model = _model;

        this.methodMappings = {
            put: ['put', 'bulkPut'],
            post: ['post', 'bulkPost', 'upsert'],
            delete: ['delete', 'bulkDelete'],
            //default is get
        };


        options = options || {};

        let defaultOptions = {
            routeOptions: {}
        }
        this.options = _.extend({}, defaultOptions, options);

        this.populateDefaultRouteOptions();



    }

    filterInternalData(data) {
        if (!data) {
            return data;
        }

        let isArray = data.constructor === Array;
        if (isArray) {
            return data;
        }

        try {
            let output = {};
            for (let key in data) {
                if (key[0] !== '$') {
                    output[key] = data[key];
                }
            }
            return output;
        }
        catch (err) {
            return data;
        }

    }

    get tableName() {
        //TODO: check this
        return this.model.tableName;
    }

    async get(req, h) {

        let where = this.modifyWhere(req, req.query.where);

        return this.model.findAll({
            where: where,
            limit: parseInt(req.query.$limit) || undefined,
            offset: parseInt(req.query.$offset) || undefined
        })
    }

    async put(req, h) {

        let where = this.modifyWhere(req, req.query.where);
        let v = await this.model.findAll({ where })

        if (v.length > 1) {
            console.log("ascaca")

            throw new Error('only single element must match where');
        }



        if (!v.length) {
            console.log("ack")
            throw new Error('Invalid criteria given')
        }

        let payload = this.modifyPayload(req, req.payload)
        return await v[0].update(payload);
    }

    async post(req, h) {
        let payload = this.modifyPayload(req, req.payload)
        return await this.model.create(payload)
    }

    async upsert(req, h) {
        let payload = this.modifyPayload(req, req.payload);
        return await this.model.upsert(payload).then(v => {
            let where = this.modifyWhere(req, req.payload)
            return this.model.findOne({
                where
            })
        }).catch(err => {
            throw err;
        })
    }


    async delete(req, h) {
        let where = this.modifyWhere(req, req.query.where);
        let v = await this.model.findOne({
            where
        })
        return v.destroy();
    }
    async count(req, h) {
        try {
            let where = this.modifyWhere(req, req.query.where);
            let group = req.query.groupBy || undefined;

            const data = await this.model.findAll({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'],
                ],
                where: where,
                group: group
            });
            return data;
        }
        catch (err) {
            return Boom.badRequest(err);
        }
    }

    async bulkPost(req, h) {

        return this.model.bulkCreate(this.modifyPayload(req, req.payload))
            .catch(Err => {
                console.error(Err);
                throw Err;
            })
        // try {
        //     return await this.model.bulkCreate(this.filterInternalData(req.payload), {
        //         logging: console.log,
        //     });
        // }
        // catch (err) {
        //     return await this.model.bulkCreate(this.filterInternalData(req.payload), {
        //     })
        // }
    }
    async bulkPut(req, h) {
        return this.model.update(this.modifyPayload(req, req.payload), {
            where: this.modifyWhere(req, req.query.where)
        })
    }

    async bulkDelete(req, h) {
        return this.model.destroy({
            where: this.modifyWhere(req, req.query.where)
        })
    }

    async stats(req, h) {
        throw new Error('not implemented');
    }



    buildRoutes(server) {
        let handlers = Object.keys(this.options.routeOptions);

        return handlers.map(handlerName => this.getRoute(server, handlerName));
    }

    getRoute(server, handlerName) {
        let routeOption = this.options.routeOptions[handlerName];
        if (!routeOption) {
            return;
        }

        let routePath = "/" + _.kebabCase(pluralize.singular(this.tableName)) + routeOption.suffix;

        let serverRouteOptions = routeOption.options || {};

        return server.route({
            method: routeOption.method,
            path: routePath,
            handler: this[handlerName].bind(this),
            options: serverRouteOptions
        })
    }

    async modifyWhere(req, where) {
        return this.filterInternalData(where);
    }

    async modifyPayload(obj) {
        return this.filterInternalData(obj);
    }



}



module.exports.GenericModel = GenericModel;


class GenericModelUserAuth extends GenericModel {
    modifyWhere(req, where) {
        where = super.modifyWhere(where);
        let userId = req.auth.credentials.id;

        where.userId = userId;
        return where;
    }
    modifyPayload(req, obj) {
        let userId = req.auth.credentials.id;

        obj = super.modifyPayload(obj);
        obj.userId = userId;
        return obj;
    }
}
module.exports.GenericModelUserAuth = GenericModelUserAuth