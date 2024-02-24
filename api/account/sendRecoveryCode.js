const db = require('../../util/db');
const sendgrid = require('../external/sendgrid/api');
module.exports = {
    route: "/api/sendRecoveryCode",
    authenticate: false,
    post: async function (req, res) {
        try {
            console.log("Recovery API working...")
            var error = "";
            const {email} = req.body;
            try {
                await db.connect(async (db) => {

                    // Find if the email even exists in our database.
                    const result = await db.collection('Users').findOne( {"email":email} );
                    console.log("Result: " + result);
                    if (result != null) {
                        sendgrid.sendCode(email,
                            "Account Recovery",
                            "{} is your recovery verification code");

                        res.status(200);
                        console.log("Email Found");
                        // console.log("Recovery Email Sent!");
                    } else {
                        res.status(503);
                        error = "Account does not exist."
                    }
                    res.json( {error: error} )

                })
            } catch (e) {
                console.log("Database not connectiing!")
                console.log(e);
            }
        } catch (e) {
            console.log("API Failure")
            console.log(e);
        }
    }

}