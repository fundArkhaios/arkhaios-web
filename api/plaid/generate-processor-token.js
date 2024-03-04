const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { forward, backward } = require('../aes');
const plaidAccount = require('./get-account');

module.exports = {
    route: '/api/plaid/generate-processor-token',
    authenticate: true,
    get: async function (req, res, user){
        //this takes the user's access token and decrypts it
        var accessToken = await backward(user.plaidAccess);
        //call the getaccount endpoint that i created to use internally. This refers to the get-account.js endpoint i wrote
        //"Items" in this case refers to the objects stored within the user object in PLaid's database
        //The other objects in here refer to the user's Plaid ID, bank account's connected, and personal info
        //The full json object returned can be seen at https://plaid.com/docs/api/accounts/#accountsget
        var userAccount = plaidAccount.getAccount(user);

        //grab their account from Plaid
        var user_id = userAccount.account_id;

        //create a request object. The information necessary is their Plaid ID, access token, and the payment
        //processor that we are going to be using. This can be changed to dwolla, alpaca, or whatever processor
        //plaid has a list of payment procecssor partners on their doc website
        var request = {
            access_token: accessToken,
            account_id: user_id,
            processor: 'alpaca',
        }

        try{
            //call the processor token endpoint from Plaid with the request object
            const response = client.processorTokenCreate(request);
            //encrypt the processor token. The response is an object of objects. 
            //response.data refers to the data object that is returned. There are a couple of fields that we could
            //look at, but the only one that we should concern ourselves with is .data
            var encryptProcessorToken = forward(response.data.processor_token);

            //if there was a response, connect to the database and store the processor token for later use
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
