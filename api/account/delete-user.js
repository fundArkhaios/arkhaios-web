const { logger } = require('../../util/logger');
const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const db = require('../../util/db');
const removePlaid = require('../plaid/remove-bank');

module.exports = {
    route: '/api/account/delete-user',
    authenticate: true,
    //pre-condition: nothing needs to be sent in the body. User is already passed in
    //post-condition: If successful, success message is returned. Failed (alongside # of pos) if otherwise
    post: async function(req, res, user){
        let success = false;

        //this checks the positions from alpaca
        const { response, status } = await alpaca.get_positions(user.brokerageID);

        //if the positions were retrieved ok AND they do not have positions to sell
        if(status == 200 && response.length == 0){
            try{
                await db.connect(async (db) => {
                    try{
                        //grab the institution names from the user object
                        let keys = Object.keys(user.bank_accounts);

                        //remove all of the access tokens from this user from Plaid database
                        for(let i = 0; i < keys.length; i++){
                            let remove = removePlaid.post(req, res, user, keys[i]);

                            if(remove.status != RESPONSE_TYPE.SUCCESS)
                                return res.status(406).json({status: remove.status, message: remove.message, data: remove.data});
                        }

                        //delete the user from the database
                        const update = await db.collection('Users').deleteOne({
                            "accountID": user.accountID
                        });

                        //if the user was deleted successfully, delete from the cache as well
                        if(update.acknowledged){
                            const key = `authenticate:${userEmail}`;
                            const data = await db.redis.get(key);

                            if(data){
                                await db.redis.del(key);
                            }

                            //log this info
                            logger.log({
                                level: 'info',
                                message: `User ${userID} deleted from database`
                            });
                        }
                        //user was not deleted successfully. something went wrong
                        else{
                            SERVER_ERROR(res);
                        }

                        success = true;
                    }
                    //if we can't delete all of these things from the database this branch is reached
                    catch(e){
                        logger.log({
                            level: 'error',
                            message: e
                        });
                    }
                })
            }
            //if we can't access the database, then we reach this branch
            catch(e){
                logger.log({
                    level: 'error',
                    message: e
                })
            }
        }
        //if the positions were retrieved, but the user has positions, return the response
        else if(status == 200 && response.length != 0){
            return res.status(500).json({ status: RESPONSE_TYPE.FAILED, message: `You have ${response.length} positions open.`, data: ""});
        }

        //otherwise everything was successful
        if(success)
            res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: 'user deleted', data: ""});
        //maybe add an else branch here in case of failure
        else
            res.status(501).json({ status: RESPONSE_TYPE.FAILED, message: 'something went wrong', data:""});
      }
}
