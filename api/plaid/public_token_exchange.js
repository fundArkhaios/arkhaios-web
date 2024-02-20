const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { forward } = require('../aes');

module.export = {
    route: '/api/plaid/public-token-exchange',
    authenticate: true,
    post: async function(req, res, publicAccessToken, user){
        var response = client.itemPublicTokenExchange({
            public_token: publicAccessToken
        });

        var error = "";
        var accessToken = forward(response.data.access_token);
        var item_id = forward(response.data.item_id);

        try{
            await db.connect(async (db) => {
                let results = await db.collection('Users').findOne(user);

                if(results){
                    await db.collection('Users').updateOne(user,
                        {$push: {"plaidAccess": accessToken, "plaidItem": item_id}});
                }
            });
        }
        catch(e){
            error = e.toString();
        }

        if(!error)
            res.status(201).json({flag: "success"});

        res.status(501).json({flag: "failure", err: error});
    }
}
