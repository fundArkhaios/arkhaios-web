const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { forward, backward } = require('../aes');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: '/api/plaid/banks',
    authenticate: true,
    get: async function (req, res, user) {
        try {
            return res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: { banks: user.bank_accounts }});
        } catch(e){
            SERVER_ERROR(res);
            return res;
        }
    }
}