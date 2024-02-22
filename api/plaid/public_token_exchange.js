const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { forward } = require('../aes');

module.exports = {
    route: '/api/plaid/public-token-exchange',
    authenticate: true,
    post: async function(req, res, user){
        var request = req.body.public_token;

        if(!request) res.status(501).json({err: "public token not received"});
        
        var response = await client.itemPublicTokenExchange({
            public_token: request,
        });

        var error = "";
        var accessToken = await forward(response.data.access_token);
        var item_id = await forward(response.data.item_id);

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
