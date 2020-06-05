
let S3_CREDS = JSON.parse(process.env.S3_CREDS);
let SMTP_CREDS = JSON.parse(process.env.SMTP_CREDS);

if(!S3_CREDS){
    throw new Error('S3 CONFIG NOT SET. Please set the environment variable "HAPI_S3" and make it a json of the following format: {"accessKeyId":"","secretAccessKey":"","bucketName":"","region":""}')
}
if(!SMTP_CREDS){
    throw new Error('SMTP_CREDS NOT SET. Please set the environment variable "SMTP_CREDS" and make it a json of the following format: {"username":"USUALLY-SAME-AS-EMAIL","password":"","sender":"","host":"smtp.gmail.com","port":465}')
}

module.exports = {
    runCrons: true,

    SMTP: SMTP_CREDS,
    S3: {
        accessKeyId: S3_CREDS.accessKeyId,
        secretAccessKey: S3_CREDS.secretAccessKey,
        bucketName: S3_CREDS.bucketName,
        region: S3_CREDS.region
    },
}