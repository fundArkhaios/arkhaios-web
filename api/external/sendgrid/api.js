const db = require('../../../util/db');
const { randomInt } = require('node:crypto')

const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    sendCode: async function(email) {
        try {
            let key = Array.from({length: 6},
                () => randomInt(10)).join('');
                
            await db.connect (async (db) => {
                try {
                    // Issue an expiry time for 20 minutes from now
                    const expiry = Date.now() + (1000 * 60 * 20);

                    await db.collection('Users').updateOne({"email" : email},
                        {$set:{verificationCode: key, verificationExpiry: expiry}});

                    await sendgrid.send({
                        to: email,
                        from: process.env.SENDGRID_FROM,
                        subject: "Your Verification Code",
                        text: key + ' is your verification code.'
                    });
                } catch(e) {
                    console.error(e);
                }
            });
        } catch(e) {}
    }
}