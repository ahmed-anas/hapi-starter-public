const models = require('../../db_schemas');
const config = require('../../../config/config');
const moment = require('moment')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports.runner = async () => {
    let formattedDate = moment().format('YYYY-MM-DD HH:mm:ss')
    await models.UserTokens.destroy({
        where: {
            expiryTime:{
                [Op.lt]: formattedDate
            }
        }
    })
}

module.exports.interval = 24 * 60 * 60 * 1000