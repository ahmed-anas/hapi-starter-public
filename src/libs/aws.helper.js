var AWS = require('aws-sdk');
var uuid = require('uuid/v4');
const { S3 } = require('../../config/config');
const crypto = require('crypto');
const fs = require('fs');
const URL = require('url');
const _ = require('lodash');
const mediaHelper = require('./media.helper');
const AWS_SIGNED_URL_EXPIRY = 600;
exports.getAWSConfig = function () {
    return new AWS.Config({
        region: aws.config.region,
        accessKeyId: aws.config.accessKeyId,
        secretAccessKey: aws.config.secretAccessKey
    });
}

const getS3 = function() {
    var myConfig = new AWS.Config({
        region: S3.region,
        accessKeyId: S3.accessKeyId,
        secretAccessKey: S3.secretAccessKey,
        signatureVersion: 'v4'
    });
    return new AWS.S3(myConfig);
}

exports.getS3 = getS3;

exports.getFileFromS3 = function(url){
    return new Promise((resolve, reject) => {

        const s3 = getS3();
        const S3_BUCKET = S3.bucketName;
        let key = url.split('.com/')[1]
        let splittedKey = key.split('.')
        let type = splittedKey[splittedKey.length-1].toLowerCase()
        s3.getObject({Bucket: S3_BUCKET, Key: key},(err,data)=>{
            if(err){
                return reject(err)
            }
            else{
                
                let buffer = Buffer.from(data.Body).toString('base64')
                let dataStreamType = mediaHelper.getDataStreamType(type);
                if(dataStreamType === false){
                    return reject("Invalid data type")
                }
                let base64Data = dataStreamType + buffer;
                return resolve({base64Data,type})
            }

        })



    })
}

function getUniqueKey() {
    return crypto.randomBytes(12).toString('hex') + (new Date()).getTime().toString(16);
}

exports.uploadFile = function(uploadType = 'case-documents', fileData = null,data= "") {
    //refernce: https://gist.github.com/homam/8646090

    return new Promise((resolve, reject) => {
        const s3 = getS3();
        const S3_BUCKET = S3.bucketName;
        const uniqueKey = getUniqueKey();
        let key = `${uploadType}/${uniqueKey}`;
        //let key = 'jpp-internal/' + uniqueKey;
        // Read in the file, convert it to base64, store to S3
        // filePath = "C:/Users/Frizhub/Desktop/dp.jpg";
        
        // fs.readFile(filePath, function (err, data) {
            // if (err) { return reject(err) }

            var base64data = new Buffer(data, 'base64');

            

            s3.putObject({
                Bucket: S3_BUCKET,
                Key: key,
                Body: base64data,
                ACL: 'public-read'
            }, function (err, resp) {
                if (err) {
                    return reject(err);
                }
                return resolve(`https://${S3_BUCKET}.s3.amazonaws.com/${key}`);
            });

        // })
    });
}

module.exports.getSignedUrlForUpload =async(ext)=> {

    return new Promise((resolve,reject) => {
        if(!_.includes(mediaHelper.ALLOWED_EXTENSIONS, ext.toLowerCase())){throw new Error('Invalid extension passed')}
        const uniqueKey = getUniqueKey();
        
        let params = {
            Key : `temp/${uniqueKey}.${ext}`,
            Bucket : S3.bucketName,
            Expires : AWS_SIGNED_URL_EXPIRY,
            ACL : 'public-read'
        }
        const s3 = getS3();

        s3.getSignedUrl('putObject', params,function(err,signedUrl)
        {
            if(err)
            {
                return reject(err)
            }
            return resolve(signedUrl)
        });
    })

}

module.exports.persistTemporaryFile = async(oldUrl,newUrl) => {
        if (!isTemporaryFile(oldUrl)) {
            throw new Error('Given directory is not a temporary directory');
        }

        let completeUrl = await copyFile(oldUrl, newUrl)
        await deleteFile(oldUrl);            
        return completeUrl;
}

function isTemporaryFile(tempUrl)
{
    let details = extractDetailsFromUrl(tempUrl);
    return details.key.substr(0, 4) === 'temp';
}

function extractDetailsFromUrl(url)
{
    let parsedUrl = URL.parse(url)
    let key = parsedUrl.path;

    if (key[0] && key[0] == '/') {
        key = key.substr(1);
    }
    let bucket = parsedUrl.hostname.split('.').reverse().pop();

    return {
        key: key,
        bucket: bucket
    }
}


const copyFile  = (currentUrl, newKey) => {
     
        if (!newKey) {
            throw new Error('key parameter not given');
        }

        const s3 = getS3();
        const S3_BUCKET = S3.bucketName;
        var currentDetails = extractDetailsFromUrl(currentUrl);

        if (S3_BUCKET !== currentDetails.bucket) {
            throw new Error('s3 buckets are different');
        }


        return new Promise((resolve,reject) => {       
            s3.copyObject({
                Bucket: S3_BUCKET,
                Key: newKey,
                CopySource: `/${currentDetails.bucket}/${currentDetails.key}`,
                ACL: 'public-read',
                MetadataDirective : 'REPLACE',
    
            }, function (err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(`https://${S3.bucketName}.s3.amazonaws.com/${newKey}`);
            })
        })

}



const deleteFile = async (currentUrl) => {
        const s3 = getS3();
        const S3_BUCKET = S3.bucketName;
        var currentDetails = extractDetailsFromUrl(currentUrl);

        if (S3_BUCKET !== currentDetails.bucket) {
            throw new Error('s3 buckets are different');
        }

        return new Promise((resolve,reject) => {
            s3.deleteObject({
                Bucket: currentDetails.bucket,
                Key: currentDetails.key
            }, function (err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            })
        })

}