const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { forward, backward } = require('../aes');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: '/api/friends/get-friends',
    authenticate: true,
    get: async function (req, res, user) {
        try {
            await db.connect(async (db) => {
                try {
                    const self = await db.collection('Friends').findOne({
                        accountID: user.accountID
                    });

                    return res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: { friends: self?.friends || [] }});
                } catch(e) {
                    SERVER_ERROR(res);
                }
            });
            
        } catch(e){
            SERVER_ERROR(res);
            return res;
        }
    }
}