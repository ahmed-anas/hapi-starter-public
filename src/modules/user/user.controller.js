const models = require('../../db_schemas');
const Boom = require('boom')

exports.getUser = async (req, h) => {

    try {
        let id = JSON.parse(req.auth.credentials.id)
        let user = await models.Users.findOne({
            where: {
                id: id
            }
        })
        return user
    } catch (err) {
        return Boom.badRequest(err)
    }


}


