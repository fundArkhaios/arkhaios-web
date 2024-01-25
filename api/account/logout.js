const db = require('../../util/db');

module.exports = {
    route: "/api/logout",
    authenticate: true,
    post: async function (req, res, user) {
        try {
            let error = '';
            
            await db.connect(async (db) => {
                try {
                    await db.collection('Users').updateOne(
                        user, {
                            $set: {
                                sessionExpiry: Date.now()
                            }
                        }
                    );
                } catch(e) {
                    error = 'server error';
                }
            });

            if(error != '') {
                res.status(401).json({error: error});
            } else {
                res.clearCookie('email');
                res.clearCookie('session');

                var ret = { status: "session ended" };
                res.status(200).json(ret);
            }
        } catch (e) { console.log(e); res.status(401).json({error: 'server error'}); }
    }
}