const db = require('./db')

module.exports = {
    /* Return the user object, assuming login was successful, and that their
       session token has not yet expired
    */
    login: async function(email, session) {
        let result = null;
        
        await db.connect(async (db) => {
            console.log(email);
            result = await db.collection('Users')
            .findOne({email: email, session: session});

            // Check if the session token has expired
            if(result && (!result.sessionExpiry || Date.now() >= result.sessionExpiry)) {
                // Nullify authentication; session expired
                result = null;
            }
        });

        return result;
    },

    /* Return the user assuming login was successful, and if they have successfully
       been assigned a brokerage user account (e.g., passed the KYC process)
    */
    kyc: async function(email, session) {
        let user = login(email, session);
        if(user && user.brokerageID) return user;
        else return null;
    }
};