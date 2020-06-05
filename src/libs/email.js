const nodemailer = require("nodemailer");
const Boom = require('boom');
const config = require('../../config/config')
exports.sendEmail = async (data) => {
    try {

        let transporter = nodemailer.createTransport({
            host: config.SMTP.host,
            port: config.SMTP.port,
            secure: true, // true for 465, false for other ports
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: config.SMTP.username, // generated ethereal user
                pass: config.SMTP.password // generated ethereal password
            }, debug: true,
            logger: true
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `Intentsify <${config.SMTP.sender}>`, // sender address
            to: data.email, // list of receivers
            subject: data.subject, // Subject line
            html: data.body, // plain text body
            // html: "<b>Hello world?</b>" // html body
        });
        // console.log("Message sent: %s", info.messageId);
        // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));



    } catch (err) {
        throw Boom.badRequest(err);
    }
}
//exports.sendEmail();