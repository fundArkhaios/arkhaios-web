const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');

const db = require('../../util/db');
const sendgrid = require('../external/sendgrid/api')

module.exports = {
    route: "/api/register",
    authenticate: false,
    post: async function(req, res) {
        let error = "";

        const { login, password, email } = req.body;

        const hash = createHash('sha256').update(password).digest('hex');

        const session = uuidv4();
        const sessionExpiry = 1000 * 3600 * 5; // By default, expire in 5 hours

        const user = {
            username: login, password: hash, email: email,
            created: Date.now(), session: session, sessionExpiry: Date.now() + sessionExpiry,
            emailVerified: false
        };

        try {
            await db.connect(async (db) => {
                if((await db.collection('Users').findOne({"email":email})) != null) {
                    error = "Email is already in use."
                } else if((await db.collection('Users').findOne({"username":login})) != null) {
                    error = 'Username has already been taken.'
                } else {
                    await db.collection('Users').insertOne(user);
                }
            });
        } catch (e) {
            error = e.toString();
        }

        if(error === '') {
            sendgrid.sendCode(email);
            res.cookie('session', session, { maxAge: sessionExpiry, httpOnly: true });
            res.cookie('email', email, { maxAge: sessionExpiry, httpOnly: true });

            var ret = { session: session, error: error };
            res.status(201).json(ret);
        } else {
            var ret = { error: error };
            res.status(201).json(ret);
        }
    }
}
