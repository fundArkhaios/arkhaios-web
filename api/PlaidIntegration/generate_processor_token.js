const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { forward, backward } = require('../aes');
const plaidAccount = require('/get_account');

module.exports = {
    route: '/api/PlaidIntegration/generate_processor_token',
    method: GET,
    authenticate: true,
    get: async function (req, res, user){
        var accessToken = backward(user.plaidAccess);
        var user_id = plaidAccount.get().accounts.account_id;

        var request = {
            access_token: accessToken,
            accout_id: user_id,
            processor: 'alpaca',
        }

        try{
            const response = client.processorTokenCreate(request);
            var encryptProcessorToken = forward(response.data.processor_token);

            if(response){
                await db.connect(async (db) => {
                    let results = await db.collection('Users').findOne(user);

                    if(results){
                        await db.collection('Users').updateOne(user,
                            {$push: {processor_token: encryptProcessorToken}});
                    }
                    else
                        res.status(400).json({error: "Something went wrong with generating Processor Token"});
                });
            }
        }
        catch(e){
            res.status(400).json({error: "Something went wrong with generating Processor Token"});
        }

        res.status(501).json({status: "Success generating the Processor Token"});
    }
}