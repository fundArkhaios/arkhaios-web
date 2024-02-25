const db = require('../../util/db');
const { logger } = require('../../util/logger')

module.exports = {
    route: "/api/check-recovery-code",
    authenticate: false,
    post: async function(req, res) {
        try {
            const { recoveryCode, email } = req.body;
            let error = "";
            
            try {

                await db.connect(async (db) => {
                    
                    const result = await db.collection('Users').findOne( {"email": email, "verificationCode": recoveryCode} );
                    
                    if (result) {
                        res.status(200);
                    } 
                    else {
                        error = "No match";
                        res.status(401)
                    }
                })
                res.json( {error: error})

            } catch(e) {
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