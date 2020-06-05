const Joi = require('@hapi/joi');
const Sequelize = require('sequelize');
exports.hasValidFields = (object, validFields) => {
    for (let key of Object.keys(object)) {
        if (validFields[key]) {
            return false;
        }
    }
    return true;
}



exports.getQueryJoiValidation = function (additionalValidation = {}) {
    return Joi.object(
        Object.assign({
            $limit: Joi.number().min(1).max(100),
            $offset: Joi.number().min(0).max(100),
        }, additionalValidation)
    );
}





exports.attributesToJoi = function (model, options) {
    let attributes = model.attributes;
    let output = {};
    for (let key in attributes) {

        //ignore keys starting with uppercase
        if (key.charAt(0).toUpperCase() === key.charAt(0)) {
            continue;
        }

        if (options.exclude && options.exclude.indexOf(key) >= 0) {
            continue;
        }

        if (options.include && options.include.indexOf(key) < 0) {
            continue;
        }
        let attr = attributes[key];
        let { type } = attr;


        const DataTypes = Sequelize.DataTypes;
        if (type instanceof Sequelize.DataTypes.DATEONLY || type instanceof Sequelize.DataTypes.DATE) {
            output[key] = Joi.date();
        }
        else if (type instanceof DataTypes.STRING || type instanceof DataTypes.ENUM) {
            output[key] = Joi.string()
        }
        else if (
            type instanceof DataTypes.INTEGER ||
            type instanceof DataTypes.FLOAT ||
            type instanceof DataTypes.NUMBER ||
            type instanceof DataTypes.SMALLINT ||
            type instanceof DataTypes.TINYINT
        ) {
            output[key] = Joi.number()
        }
        else {
            throw new Error('data type not implemented', key, type)
        }

    }
    return Joi.object(output);
}

exports.getLimitOffset = function (req) {

    let limit = req.query.$limit || 10;
    let offset = req.query.$offset || 0;

    limit = Math.min(limit, 100);
    limit = Math.max(0, limit);

    offset = Math.min(offset, 100);
    offset = Math.max(0, offset);
    return { limit, offset };
}

