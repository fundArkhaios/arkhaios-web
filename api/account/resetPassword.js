const db = require('../../util/db');
const { createHash } = require('crypto');


module.exports =  {
    route: "/api/resetPassword",
    authenticate: false,
    post: async function (req, res) {
        try {
            console.log("Reset Password API is working!");


            // JSON Response
            var message = "";
            var status = ""
            //


            const { email, password } = req.body;
            console.log("Email: " + email);
            console.log("Password: " + password);

            var hashPass = createHash('sha256').update(password).digest('hex'); // Hash Password with SHA256

            try {

                await db.connect(async (db) => {

                    const result = await db.collection('Users').updateOne(
                        {email: email},
                        {
                            $set: { password: hashPass }
                        }
                    );
                
                    if (result.modifiedCount == 1) {
                        status = "success";
                        res.status(200);
                    } else {
                        res.status(500);
                        status = "failed";
                    }
                })
                res.json( {status: status});

            } catch(e) { 
                console.error (e);
            }


        } catch(e) {
            console.error(e);
        }
    } 
}
