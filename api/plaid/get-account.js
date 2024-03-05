const { backward } = require('../aes');
const { client } = require('../plaid_configs');

module.exports = {
    //it should be noted that this is not an API endpoint, this is merely an internal function to grab the account
    //this function is to be used in other endpoints
    getAccount: async function (user) {
        //decrypt plaid access token
        var userAccess = await backward(user.plaidAccess);

        //create request object
        var request = {
            access_token: userAccess,
        }

        //call the authGet endpoint from Plaid
        var account = await client.authGet(request);

        //return the account
        return account; 
    }
}
