const db = require('../../util/db');

const sendgrid = require('../external/sendgrid/api');
const { RESPONSE_TYPE } = require('../response_type');

module.exports = {
    route: '/api/account/verify',
    authenticate: true,
    unverified: true,
    post: async function(req, res, user) {
        if(user.emailVerified === true) {
            res.status(401).json({
                status: RESPONSE_TYPE.FAILED,
                message: "email has already been verified",
                data: {}
            });
        } else if (req.body.resend == true) {
            sendgrid.sendCode(user.email,
                "Account Recovery", "We see you requested a new verification code!");

            res.status(200).json({
                status: RESPONSE_TYPE.SUCCESS,
                message: "a new verification code has been sent",
                data: {}
            })
        } else if(Date.now() >= user.verificationExpiry) {
            res.status(401).json({
                status: RESPONSE_TYPE.FAILED,
                message: "verification code has expired",
                data: {}
            })
        }  else {
            if(user.verificationCode == req.body.verificationCode) {
                await db.updateUser(user, {
                    emailVerified: true
                })

                res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: '', data: {} });
            } else {
                res.status(200).json({ status: RESPONSE_TYPE.FAILED, message: "invalid verification code", data: {}});
            }
        }
    }
}