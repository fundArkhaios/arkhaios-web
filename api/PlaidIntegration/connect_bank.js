const { client, configs } = require('../plaid_configs');
const aes = require('../aes');
const db = require('../util/db');

module.exports = {
    authenticate: true,
    linkToken: async function(req, res){
        var tokenResponse = await client.linkTokenCreate(configs);

        res.status(201).json(tokenResponse.data);
    },

    exchangePublicToken: async function(publicAccessToken, usr){
        var response = await client.itemPublicTokenExchange({
            public_token: publicAccessToken,
        });

        var permAccessToken = response.data.access_token;
        var encryptPlaid = aes.forward(permAccessToken);

        //store the permanent access token in the database, ENCRYPTED
        try{
            await db.connect(async (db) => {
                let results = await db.collection('Users').findOne({usr});

                if(results){
                    await db.collection('Users').updateOne({usr}, 
                        {$push: {"plaidAccess": encryptPlaid}});
                }
            });
        }
        catch(e){
            var error = e.toString();
        }

        if(!error)
            res.status(201).json({flag: "success"});

        res.status(501).json({flag: "failure", err: error});
    }
}
