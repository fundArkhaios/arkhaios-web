const { client } = require('../plaid_configs');
const { backward } = require('../aes');

module.exports = {
    route: '/api/plaid/get-account',
    authenticate: true,
    get: async function(req, res, user){
        const accessToken = backward(user.plaidAccess);

        const request = {
            access_token: accessToken,
        }

        const response = client.authGet(request);

        res.json(response);
    }
}


//to do
//Finish the get accounts to retrieve the account ID
//get account ID for processor token endpoint
//store the item_id in the database for the public_token_exchange endpoint
