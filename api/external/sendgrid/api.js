const db = require('../../../util/db');
const { randomInt } = require('node:crypto')

const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const { logger } = require('../../../util/logger')

module.exports = {
    // Signup Function
    sendCode: async function(email, subject) {
        try {
            let key = Array.from({length: 6},
                () => randomInt(10)).join('');

            // Issue an expiry time for 20 minutes from now
            const expiry = Date.now() + (1000 * 60 * 20);

            const result = await db.updateUser({ email: email }, {
                verificationCode: key, verificationExpiry: expiry
            })

            await db.connect(async (db) => {
                try {
                    const user = await db.collection('Users').findOne({ "email": email });
                        
                    if(result) {
                        let r = await sendgrid.send({
                            from: process.env.SENDGRID_FROM,
                            template_id: process.env.SENDGRID_TEMPLATE,
                            personalizations: [{
                                to: { email: email },
                                dynamicTemplateData: {
                                    subject: subject,
                                    Sender_Name: user.firstName,
                                    Code: key
                                }
                            }]
                        });

                        console.log("resp: " + r);
                    }
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })
                }
            });
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })
        }
    }
}