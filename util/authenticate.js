const db = require('./db')

module.exports = {
    login: async function(user, session) {
        let result = null;
        
        await db.connect(async (db) => {
            result = await db.collection('Users')
            .findOne({username: user, session: session});

            // Check if the session token has expired
            if(result && Date.now() >= result?.sessionExpiry) {
                // Nullify authentication; session expired
                result = null;
            }
        });

        return result;
    }
};