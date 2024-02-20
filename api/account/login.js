const db = require('../../util/db');
const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');
const speakeasy = require('speakeasy');
const aes = require('../aes');
const RESPONSE_TYPE = require('../response_type');
const { hash } = require('../hashAlgo');

module.exports = {
    route: "/api/login",
    authenticate: false,
    post: async function (req, res) {
        try {
            var error = '';
            let data = {};

            let response = RESPONSE_TYPE.FAILED;

            const { email, password } = req.body;

            //var hash = createHash('sha256').update(password).digest('hex');
            
            const sessionExpiry = 1000 * 3600 * 5; // By default, sessions expire in 5 hours

            await db.connect(async (db) => {
                try {
                    const user = await db.collection('Users').
                    findOne({ email: email });

                    let { hashed, salt, iter } = hash(password, user.salt, user.iter);
                    
                    if (user.password == hashed) {
                        let authenticate = false;

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

                        if(authenticate) {
                            response = RESPONSE_TYPE.SUCCESS;

                            const session = uuidv4();

                            data["session"] = session;

                            await db.collection('Users').updateOne(
                                {
                                    "email": email,
                                    "password": hash
                                },
                                {
                                    $set: {
                                        sessionToken: session,
                                        sessionExpiry: Date.now() + sessionExpiry
                                    }
                                }
                            );
                        }
                    } else error = 'invalid credentials';
                } catch(e) {
                    console.log(e);
                    error = 'server error';
                    response = RESPONSE_TYPE.ERROR;
                }
            });

            if(error != '') {
                res.status(401).json({status: response, error: error});
            } else {
                res.cookie('email', email, { maxAge: sessionExpiry, httpOnly: true, sameSite: true});
                res.cookie('session', data.session, { maxAge: sessionExpiry, httpOnly: true, sameSite: true });

                var ret = { status: response, message: error, data: data };
                res.status(200).json(ret);
            }
        } catch (e) { console.log(e); res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'}); }
    }
}
