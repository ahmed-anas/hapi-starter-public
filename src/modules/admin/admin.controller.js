const PublicAdmins = require('../../db_schemas').Admins.scope('public');
module.exports.getAdmins = async function (req, h) {
    return PublicAdmins.findAll({})
}