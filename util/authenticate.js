const { commandOptions } = require('redis');
const db = require('./db')

module.exports = {
    /* Return the user object, assuming login was successful, and that their
       session token has not yet expired
    */
    login: async function(email, session) {
        let result = null;

        const key = `authenticate:${email}`;
        const data = await db.redis.get(key)

        if(data) {
            const authentication = JSON.parse(data);
            if(authentication.sessionToken == session) {
                if(Date.now() < authentication.sessionExpiry) {
                    result = authentication;
                }
            }
        }

        if(!result) {
            await db.connect(async (db) => {
                result = await db.collection('Users')
                .findOne({email: email, sessionToken: session});
                // Check if the session token has expired
                if(result && (Date.now() >= result.sessionExpiry)) {
                    // Nullify authentication; session expired
                    result = null;
                }
            });

            if(result) {
                await db.redis.setEx(key, Math.trunc((result.sessionExpiry - Date.now()) / 1000), JSON.stringify(result));
            }
        }
    
        return result;
    }
};