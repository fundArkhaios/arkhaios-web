const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/logout",
    authenticate: true,
    unverified: true,
    post: async function (req, res, user) {
        try {
            const result = await db.updateUser(user, {
                sessionExpiry: Date.now()
            })

            if(!result) return SERVER_ERROR(res)

            const key = `authenticate:${user.email}`
            if(await db.redis.get(key)) {
                await db.redis.del(key)
            }

            res.clearCookie('email');
            res.clearCookie('session');

            res.status(200).json({
                status: RESPONSE_TYPE.SUCCESS,
                message: "session ended",
                data: {}
            });
        } catch (e) {
            console.log(e)
            SERVER_ERROR(res)
        }
    }
}
