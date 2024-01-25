const db = require('../../util/db');
module.exports = {
    route: "/api/checkRecoveryCode",
    authenticate: false,
    post: async function(req, res) {
        try {
            console.log("Check Recovery Code API Working...");

            const { recoveryCode, email } = req.body;
            let error = "";
            
            try {

                await db.connect(async (db) => {
                    
                    const result = await db.collection('Users').findOne( {"email": email, "verificationCode": recoveryCode} );
                    
                    if (result) {
                        res.status(200);
                    } 
                    else {
                        error = "No match";
                        res.status(401)
                        console.log("Verification Code does not match.")
                    }
                })
                res.json( {error: error})

            } catch(e) {
                console.error(e);
            }
        } catch (e) {
            console.error(e);
        }

    }


}