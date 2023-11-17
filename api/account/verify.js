const db = require('../../util/db');
const authenticate = require('../../util/authenticate')

const sendgrid = require('../external/sendgrid/api')

module.exports = {
    route: '/api/verify',
    authenticate: true,
    post: async function(req, res, user) {
        if(user.emailVerified === true) {
            res.status(401).json({error: "email has already been verified"});
        } else if(Date.now() >= user.verificationExpiry || req.body.resend == true) {
            sendgrid.sendCode(user.email);
            res.status(200).json({ error: "verification code has expired",
                                   message: "a new verification code has been sent."});
        } else {
            if(user.verificationCode == req.body.verificationCode) {
                await db.connect(async (db) => {
                    await db.collection('Users').updateOne(user,
                        {
                            $set:{
                                emailVerified: true
                            }
                        }
                    );

                    res.status(200).json({ status: "success" });
                });
            } else {
                res.status(200).json({ error: "invalid verification code"});
            }
        }
    }
}