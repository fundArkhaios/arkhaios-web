const db = require('./db')

module.exports = {
    login: async function(email, session) {
        let result = null;

        const key = `authenticate:${email}`;
        
        // Get the Redis client instance from the updated db.js
        const redis = db.redis;
        
        // Make sure to use the connected Redis client
        const data = await redis.get(key);

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
                .findOne({ email: email, sessionToken: session });

                if(result && Date.now() >= result.sessionExpiry) {
                    result = null;
                }
            });

            if(result) {
                // Set the session data with an expiration based on the remaining time until the session expiry
                await redis.setEx(key, Math.trunc((result.sessionExpiry - Date.now()) / 1000), JSON.stringify(result));
            }
        }
    
        return result;
    }
};