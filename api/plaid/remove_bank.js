const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { backward } = require('../aes');

module.exports = {
    route: '/api/plaid/remove-bank',
    authenticate: true,
    post: async function(req, res, user){
        //grab decrypted access token from database
        var accessToken = await backward(user.plaidAccess);
        var error = "";

        //create request object, we only need an access token here. 
        const request = {
            access_token: accessToken
        }

        //SIDE NOTE, when we are deleting a user in OUR database, we check to see if they have positions
        //should we do that here as well? How should we handle that?
        //My thoughts are as follows:
        //If user has positions:
            //if user has more than one bank account:
                //if we can transfer to that bank account:
                    //delete the bank account they are trying to remove
                //else:
                    //ask them to sell all of their positions to be able to transfer the money to their account, and try
                    //to delete the account afterwards
            //else:
                //ask user to sell all of their positions and try to delete the account afterwards
        //else:
            //delete the bank account
        
        try{
            //call the Plaid endpoint for removing an item (should remove ALL of their accounts, not just one)
            var response = await client.itemRemove(request);

            if(!response)
                res.status(500).json({error: "Something went wrong"});

            //remove their access token from the database, it should be invalid
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
