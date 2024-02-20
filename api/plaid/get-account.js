const { backward } = require('../aes');
const { client } = require('../plaid_configs');


async function getAccount(user){
    var userAccess = backward(user.plaidAccess);
    
    var request = {
        access_token: userAccess,
    }

    var account = client.authGet(request);

    return account;
}
