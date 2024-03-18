const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: 'api/plaid/get-inst-name',
    authenticate: true,
    get: async function(req, res, user){
        try{
            await db.connect(async (db) => {
                var result = await db.collection('Users').findOne({ "accountID": user.accountID });

                if(result){
                    res.status(200).json({ 
                        status: RESPONSE_TYPE.SUCCESS, 
                        message: "retrieving names", 
                        data: user.institution_names 
                    });
                }
                else{
                    SERVER_ERROR(res);
                }
            })
        }
        catch(e){
            SERVER_ERROR(res);
        }
    }
}