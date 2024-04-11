const db = require('./db')

module.exports = {
    login: async function(email, session) {
        let result = null;

        const key = `authenticate:${email}`;
        
        // Make sure to use the connected Redis client
        let data = null;
        
        console.log("auth");
        try {
            // Get the Redis client instance from the updated db.js
            data = await db.redis_get(key);
        } catch(e) { data = null; }

        console.log("data: " + data);
        if(data) {
            const authentication = JSON.parse(data);
            if(authentication.sessionToken == session) {
                if(Date.now() < authentication.sessionExpiry) {
                    result = authentication;
                }
            }
        }

        console.log("res:");
        console.log(result);

        if(!result) {
            console.log("find user");
            await db.connect(async (db) => {
                result = await db.collection('Users')
                .findOne({ email: email, sessionToken: session });

                console.log(result);
                if(result && Date.now() >= result.sessionExpiry) {
                    console.log("invalid");
                    result = null;
                }
            });

            console.log("nop");

            try {
                if(result) {
                    // Set the session data with an expiration based on the remaining time until the session expiry
                    await db.redis_set(key, Math.trunc((result.sessionExpiry - Date.now()) / 1000), JSON.stringify(result));
                }
            } catch(e) {}
        }
    
        return result;
    }
};