const mediaHelper = require('../../libs/media.helper')
const awsHelper = require('../../libs/aws.helper')
const models = require('../../db_schemas');

exports.createSignedUrl = async function (req, h) {
    let extension = req.query.extension;

    let type = mediaHelper.getTypeFromExtension(extension);

    let signedUrl = await awsHelper.getSignedUrlForUpload(extension);
    let toSaveUrl = signedUrl.split('?')[0];
    let userId = req.auth.credentials.id;

    let mediaObj = {
        url: toSaveUrl,
        type: type,
        isdeleted: false,
        extension: extension,
        userId

    }
    await models.Media.create(mediaObj)

    return {
        uploadUrl: signedUrl,
        medium: mediaObj
    };
}