const db = require('../../util/db');
const sendgrid = require('../external/sendgrid/api');
const { logger } = require('../../util/logger')

module.exports = {
    route: "/api/account/send-recovery-code",
    authenticate: false,
    post: async function (req, res) {
        try {
            var error = "";
            const { email } = req.body;

            try {
                await db.connect(async (db) => {
                    // Find if the email even exists in our database.
                    const result = await db.collection('Users').findOne( {"email":email} );
                    
                    if (result != null) {
                        sendgrid.sendCode(email,
                            "Account Recovery", "We see you requested a password reset!");

                        res.status(200);
                        
                    } else {
                        res.status(503);
                        error = "Account does not exist."
                    }
                    res.json( {error: error} )

                })
            } catch (e) { 
                logger.log({
                    level: 'error',
                    message: e
                })
            }
        } catch (e) {
            logger.log({
                level: 'error',
                message: e
            })
        }
    }

}