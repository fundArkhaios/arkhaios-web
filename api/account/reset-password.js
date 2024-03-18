const db = require('../../util/db');
const { logger } = require('../../util/logger');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

async function checkRecovery(recoveryCode, email){
    try{
        await db.connect(async (db) => {
            const result = await db.collection('Users').findOne(
                {
                    "email": email, 
                    "verificationCode": recoveryCode
                });

            if(result){
                return true;
            }

            return false;
        })
    }
    catch(e){
        return false;
    }
}

module.exports =  {
    route: "/api/account/reset-password",
    authenticate: false,
    post: async function (req, res) {
        try {
            const { recoveryCode, email, password } = req.body;

            const isAuthentic = checkRecovery(recoveryCode, email);

            var { hashed, salt, iter } = hash(password, '', 0);
            
            if(isAuthentic){
                try {
                    const result = await db.updateUser(user, {
                        password: hashed,
                        salt: salt,
                        iter: iter
                    })

                    if(result) {
                        res.status(200).json( {status: RESPONSE_TYPE.SUCCESS, message: "password reset", data: ""});
                    } 
                    else {
                        SERVER_ERROR(res);
                    }
                } 
                catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })
                }
            }
            else{
                res.json({status: RESPONSE_TYPE.FAILED, message: "password not reset", data: ""});
            }
        } 
        catch(e) {
            logger.log({
                level: 'error',
                message: e
            })
        }
    }
}
