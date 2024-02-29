const { logger } = require('./logger');
const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const db = require('../../util/db');

module.exports = {
    route: '/api/account/delete-user',
    authenticate: true,
    post: async function(req, res, user){
        let success = false;
    
        const { response, status } = await alpaca.get_positions(user.brokerageID);
        const userID = user.accountID;
        const userEmail = user.email;
    
        if(status == 200 && response.length == 0){
            try{
                await db.connect(async (db) => {
                    try{
                        const update = await db.collection('Users').deleteOne({
                            "accountID": userID
                        })
    
                        if(update.acknowledged){
                            const key = `authenticate:${userEmail}`;
                            const data = await db.redis.get(key);
    
                            if(data){
                                await db.redis.del(key);
                            }

                        logger.log({
                            level: 'info',
                            message: `User ${userID} deleted from database`
                        })
                        }
                        else{
                            SERVER_ERROR(res);
                        }
    
                        success = true;
                    }
                    catch(e){
                        logger.log({
                            level: 'error',
                            message: e
                        })
                    }
                })
            }
            catch(e){
                logger.log({
                    level: 'error',
                    message: e
                })
            }
        }
        else if(status == 200 && response.length != 0){
            return res.status(500).json({ status: RESPONSE_TYPE.FAILED, message: `You have ${response.length} positions open.`});
        }
    
        res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: ''});
      },
}