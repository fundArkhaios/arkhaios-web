const db = require('../../util/db');
const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');

module.exports = {
    route: "/api/login",
    authenticate: false,
    post: async function (req, res) {
        try {
            var error = '';

            const { email, password } = req.body;

            var hash = createHash('sha256').update(password).digest('hex');

            const session = uuidv4();
            const sessionExpiry = 1000 * 3600 * 5; // By default, expire in 5 hours

            await db.connect(async (db) => {
                try {
                    const result = await db.collection('Users').
                    findOne({ email: email, password: hash });

                    if (result) {
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
                    } else error = 'invalid credentials';
                } catch(e) {
                    error = 'server error';
                }
            });

            if(error != '') {
                res.status(401).json({error: error});
            } else {
                res.cookie('email', email, { maxAge: sessionExpiry, httpOnly: true });
                res.cookie('session', session, { maxAge: sessionExpiry, httpOnly: true });

                var ret = { token: session, error: error };
                res.status(200).json(ret);
            }
        } catch (e) { res.status(401).json({error: 'server error'}); }
    }
}