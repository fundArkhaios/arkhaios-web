const db = require('../../util/db');

module.exports = {
    route: "/api/logout",
    authenticate: true,
    post: async function (req, res, user) {
        try {
            let error = '';

            const result = await db.updateUser(user, {
                sessionExpiry: Date.now()
            })

            if(!result) {
                return res.status(500).json({error: 'server error'})
            }

            const key = `authenticate:${user.email}`
            if(await db.redis.get(key)) {
                await db.redis.del(key)
            }

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
