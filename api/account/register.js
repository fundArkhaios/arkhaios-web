const { uniqueNamesGenerator, NumberDictionary, adjectives, colors, animals } = require('unique-names-generator');
const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');
const sendgrid = require('../external/sendgrid/api')
const db = require('../../util/db');
const { hash } = require('../hashAlgo');

function generateUsername() {
    const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
    username = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals, numberDictionary],
        length: 4,
        separator: '-',
        style: 'capital'
    });
    // Format: [adjective]-[color]-[animal]-[100-999]
    return username;
}
        
module.exports = {
    route: "/api/account/register",
    authenticate: false,
    post: async function(req, res) {
        try {
            console.log("TESTING");
            
            var error = '';
            var status = "failed";
            
            const { firstName, lastName, email, password } = req.body;
            
            var hashPass = hash(password, '', 0); // Hash password with SHA256
            var username = generateUsername(); // Generate username Ex: Fast-Red-Elephant-281

            var session = uuidv4(); // Generate session token
            const sessionExpiry = 1000 * 3600 * 5; // By default, expire in 5 hours

            var id = uuidv4();

            let creationTime = Date.now(); 
            
            const newUser = {
                id: id,
                firstName: firstName,
                lastName: lastName, 
                username: username,
                email: email,
                password: hashPass, 
                emailVerified: false,
                verificationCode: 0,
                mfaVerified: false,
                kycVerified: false,
                sessionToken: session, 
                sessionExpiry: Date.now() + sessionExpiry,
                creationTime: creationTime
            };

            try {
                console.log("CONNECTING");
                await db.connect(async (db) => {

                    if((await db.collection('Users').findOne({"email":email})) != null) {
                        error = "Email is already in use."
                        throw new Error('Email is already in use.')
                    }   
                    
                    while (await db.collection('Users').findOne({username: username}) != null) {
                        console.log("Attempting new username Generation")
                        username = generateUsername();
                    }
                    
                    try {
                        const result = await db.collection('Users').insertOne(newUser)
                        if (result.acknowledged === false) {
                            console.log('Insert operation was not acknowledged by the server');
                            res.status(500)
                        } else {
                            console.log('Insert operation was successful');
                            status = "Success";
                        }  
                    } catch (e) {
                        console.log(e.toString());   
                    };
                });
            } catch (e) {
                console.log(error = e.toString());
            }

            if(status === 'Success') {
                sendgrid.sendCode(email);
                
                res.cookie('session', session, { maxAge: sessionExpiry, httpOnly: true , sameSite: 'strict'});
                res.cookie('username', username, { maxAge: sessionExpiry, httpOnly: true });
                res.cookie('email', email, {maxAge: sessionExpiry, httpOnly: true});

                var ret = { session: session, status: status };

                res.status(201).json(ret);
                console.log("Everything Successful!")
            } else {
                var ret = { error: error, status: status };
                res.status(409).json(ret);
            }
        } catch (e) {
            console.log(e.toString())
            console.log("Some generation error or bad request from client.")
        }
    }
}
