const crypto = require('crypto');
const models = require('../db_schemas');
const awsHelper = require('./aws.helper');

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'tiff', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlxs', 'csv', 'txt', 'rtf', 'ppt', 'pptx'];
const MEDIA_ENTITY_TYPES = {
    PROFILE_PICTURE: 'profile_picture',
};

function isExtensionAllowed(extension) {
    return ALLOWED_EXTENSIONS.includes(extension.toLowerCase())
}

exports.getDataStreamType = function (extension) {
    extension = extension.toLowerCase();
    if (extension == "jpg" || extension == "jpeg" || extension == 'png' || extension == 'tiff' || extension == 'gif') {
        return `data:image/${extension};base64,`
    }
    else {
        return false;
    }
}

exports.uploadMedia = async (sourceUrl, entityType, payload) => {
    let trimmedOldUrl = sourceUrl.split('?')[0];
    let extension = trimmedOldUrl.split('.').pop();

    let newPath = generatePersistentMediaUrlForS3(entityType, extension, payload);

    var newUrl = await awsHelper.persistTemporaryFile(trimmedOldUrl, newPath);

    let mediaObj = await updateMediaUrl({
        oldUrl: trimmedOldUrl,
        newUrl: newUrl
    });

    if (mediaObj) {
        return mediaObj.id;
    }
    else {
        return null;
    }
}

const generatePersistentMediaUrlForS3 = (type, extension, options) => {
    if (isExtensionAllowed(extension)) {
        let uniqueKey = getUniqueKey();
        let url = "";


        if (type == MEDIA_ENTITY_TYPES.PROFILE_PICTURE) {
            if (!options.userId) {
                throw new Error('Invalid parameters passed')
            }

            let userId = options.userId;
            url = `users/${userId}/profile-photos/${uniqueKey}.${extension}`;
        }
        else {
            throw new Error('unhandled media entity type constant')
        }
        return url;
    }
    else {
        throw new Error('Invalid extension passed with url')
    }
}

module.exports.generatePersistentMediaUrlForS3 = generatePersistentMediaUrlForS3;

module.exports.getTypeFromExtension = function (ext) {
    ext = ext.toLowerCase();
    if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "tiff" || ext == "gif") {
        return "image";
    }
    else if (ext == "doc" || ext == "docx" || ext == "xls" || ext == "xlxs" || ext == "csv" || ext == "ppt" || ext == "pptx" || ext == "txt" || ext == "rtf") {
        return "officeDocument"
    }
    else if (ext == "pdf") {
        return "pdfDocument"
    }
    else {
        return false
    }
}

function getUniqueKey() {
    return crypto.randomBytes(12).toString('hex') + (new Date()).getTime().toString(16);
}


const updateMediaUrl = async (urlObj) => {
    if (!urlObj.oldUrl) { throw new Error('No old url passed') }
    if (!urlObj.newUrl) { throw new Error('No new url passed') }

    await models.Media.update({
        url: urlObj.newUrl,
        isPermanent: true
    },
        {
            where: {
                url: urlObj.oldUrl
            }
        })

    return await models.Media.findOne({
        where: {
            url: urlObj.newUrl
        }
    })
}

exports.ALLOWED_EXTENSIONS = ALLOWED_EXTENSIONS;
exports.MEDIA_ENTITY_TYPES = MEDIA_ENTITY_TYPES;