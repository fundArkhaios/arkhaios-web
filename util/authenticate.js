const db = require('./db')

module.exports = {
    login: async function(user, session) {
        let result = await db.connect(async (db) => {
            return await db.collection('Users')
            .findOne({id: parseInt(user), sessionToken: session});

        });

        return result;
    }
};