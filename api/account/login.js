const db = require('../../util/db');
const { v4: uuidv4 } = require('uuid');
const speakeasy = require('speakeasy');
const aes = require('../aes');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { hash } = require('../hashAlgo');
const { logger } = require('../../util/logger')

module.exports = {
    route: "/api/account/login",
    authenticate: false,
    post: async function (req, res) {
        try {
            var error = '';
            let data = {};

            const hostname = req.hostname;

            let response = RESPONSE_TYPE.FAILED;

            const { email, password } = req.body;

            const sessionExpiry = 1000 * 3600 * 5; // By default, sessions expire in 5 hours

            let authenticate = false;
            let user = null;

            await db.connect(async (db) => {
                try {
                    user = await db.collection('Users').
                    findOne({ email: email });

                    if (user) {
                        let { hashed, salt, iter } = hash(password, user.salt, user.iter);
                    
                        if (user.password == hashed) {
                            if(user.mfaVerified) {
                                if(!req.body.mfa) data["mfa"] = true;
                                else {
                                    var base32Encrypted = user.base32Secret;
    
                                    var base32 = await aes.backward(base32Encrypted);
                            
                                    var verified = speakeasy.totp.verify({secret: base32,
                                                                        encoding: 'base32',
                                                                        token: req.body.mfa});
                            
                                    if(verified) {
                                        authenticate = true;
                                    } else error = 'invalid mfa code';
                                }
                            } else authenticate = true;
                        }
                    } else error = 'invalid credentials';
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })

                    error = 'server error';
                    response = RESPONSE_TYPE.ERROR;
                }
            });
            
            if(authenticate) {
                response = RESPONSE_TYPE.SUCCESS;

                const session = uuidv4();

                data["session"] = session;

                const result = await db.updateUser(user, {
                    sessionToken: session,
                    sessionExpiry: Date.now() + sessionExpiry
                });
                
                if(!result) {
                    // Failed to write to db
                    response = RESPONSE_TYPE.ERROR;
                }
            }

            if(error != '') {
                res.status(401).json({status: response, message: error});
            } else {
                res.cookie('email', email, { maxAge: sessionExpiry, httpOnly: true, sameSite: 'none', domain: hostname, secure: true});
                res.cookie('session', data.session, { maxAge: sessionExpiry, httpOnly: true, sameSite: 'none', domain: hostname, secure: true});

                res.status(200).json({ status: response, message: error, data: data });
            }
        } catch (e) {
            logger.log({
                level: 'error',
                message: e
            })

            SERVER_ERROR(res)
        }
    }
}
