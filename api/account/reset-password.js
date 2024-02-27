const db = require('../../util/db');
const { logger } = require('../../util/logger')

module.exports =  {
    route: "/api/account/reset-password",
    authenticate: false,
    // This needs to be refactored:
    // major security concern regarding password resets
    stub: async function (req, res) {
        try {
            // JSON Response
            var message = "";
            var status = ""

            const { email, password } = req.body;

            var { hashed, salt, iter } = hash(password, '', 0);
            
            try {
                const result = await db.updateUser(user, {
                    password: hashed,
                    salt: salt,
                    iter: iter
                })

                if(result) {
                    status = "success";
                    res.status(200);
                } else {
                    res.status(500);
                    status = "failed";
                }

                res.json( {status: status});

            } catch(e) {
                logger.log({
                    level: 'error',
                    message: e
                })
            }


        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })
        }
    } 
}
