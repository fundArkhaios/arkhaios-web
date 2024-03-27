const db = require('../../../util/db');
const { randomInt } = require('node:crypto')

const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const { logger } = require('../../../util/logger')

module.exports = {
    // Signup Function
    sendCode: async function(email, subject, text) {
        try {
            let key = Array.from({length: 6},
                () => randomInt(10)).join('');

            // Issue an expiry time for 20 minutes from now
            const expiry = Date.now() + (1000 * 60 * 20);

            const result = await db.updateUser({ email: email }, {
                verificationCode: key, verificationExpiry: expiry
            })

            if(result) {
                await sendgrid.send({
                    to: email,
                    from: process.env.SENDGRID_FROM,
                    subject: subject,
                    text: text.replace("{}", key)
                });
            }
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })
        }
    }
}