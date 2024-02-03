const db = require('./db')

module.exports = {
    /* Return the user object, assuming login was successful, and that their
       session token has not yet expired
    */
    login: async function(email, session) {        
        var result = null;


        await db.connect(async (db) => {
            result = await db.collection('Users')
            .findOne({email: email, sessionToken: session});
            // Check if the session token has expired
            if(result && (Date.now() >= result.sessionExpiry)) {
                // Nullify authentication; session expired
                result = null;
            }
        });
    
        return result;
    }
};