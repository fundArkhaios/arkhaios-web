const db = require('../../util/db');
const { createHash } = require('crypto');
const { hash } = require('../hashAlgo.js');


module.exports =  {
    route: "/api/resetPassword",
    authenticate: false,
    post: async function (req, res) {
        try {
            console.log("Reset Password API is working!");


            // JSON Response
            var message = "";
            var status = "";
            //


            const { email, password } = req.body;

            //var hashPass = createHash('sha256').update(password).digest('hex'); // Hash Password with SHA256
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

                res.json( {status: status } );

            } catch(e) { 
                console.error (e);
            }


        } catch(e) {
            console.error(e);
        }
    } 
}
