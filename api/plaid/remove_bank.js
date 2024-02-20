const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { backward } = require('../aes');

module.export = {
    route: '/api/plaid/remove-bank',
    authenticate: true,
    post: async function(req, res, user){
        var accessToken = backward(user.plaidAccess);
        var error = "";

        const request = {
            access_token: accessToken
        }

        try{
            var response = await client.itemRemove(request);

            if(!response)
                res.status(500).json({error: "Something went wrong"});

            await db.connect(async (db) => {
                let results = await db.collection('Users').findOne(user);

                if(results){
                    await db.collection('Users').updateOne(user,
                        {$unset: {"plaidAccess": ""}}
                    );
                }
            });
        }
        catch(err){
            error = err.toString();
        }

        res.status(200).json({flag: "Success! Bank Account deleted."});
    }
}
