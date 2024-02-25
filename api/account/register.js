const { uniqueNamesGenerator, NumberDictionary, adjectives, colors, animals } = require('unique-names-generator');
const { v4: uuidv4 } = require('uuid');
const sendgrid = require('../external/sendgrid/api')
const db = require('../../util/db');
const { hash } = require('../hashAlgo');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
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

function generateAccountID() {
    return uuidv4().substring(0, 18)
}

module.exports = {
    route: "/api/account/register",
    authenticate: false,
    post: async function(req, res) {
        response = RESPONSE_TYPE.ERROR;

        try {
            var error = '';
            
            const { firstName, lastName, email, password } = req.body;
            
            var { hashed, salt, iter } = hash(password, '', 0); // Hash password with SHA256
            var username = generateUsername(); // Generate username Ex: Fast-Red-Elephant-281

            var session = uuidv4();
            const sessionExpiry = 1000 * 3600 * 5; // By default, expire in 5 hours

            let creationTime = Date.now(); 
            
            const user = {
                accountID: generateAccountID(),
                firstName: firstName,
                lastName: lastName, 
                username: username,
                email: email,
                password: hashed,
                salt: salt, 
                iter: iter,
                emailVerified: false,
                verificationCode: 0,
                mfaVerified: false,
                kycVerified: false,
                sessionToken: session, 
                sessionExpiry: Date.now() + sessionExpiry,
                creationTime: creationTime
            };

            try {
                await db.connect(async (db) => {
                    // Ensure email is not in use
                    if((await db.collection('Users').findOne({"email":email})) != null) {
                        error = "Email is already in use."
                        return;
                    }   
                    
                    // Ensure username is unique
                    // `username` is also a unique MongoDB index to ensure no race conditions occur
                    while (await db.collection('Users').findOne({username: username}) != null) {
                        // Generate a new username
                        user.username = generateUsername();
                    }
                    
                    // Ensure accountID is unique
                    while (await db.collection('Users').findOne({accountID: accountID}) != null) {
                        // Generate a new account ID
                        user.accountID = generateAccountID();
                    }
                    
                    try {
                        const result = await db.collection('Users').insertOne(user)
                        if (result.acknowledged === false) {
                            response = RESPONSE_TYPE.ERROR
                        } else {
                            response = RESPONSE_TYPE.SUCCESS
                        }  
                    } catch (e) {
                        response = RESPONSE_TYPE.ERROR
                        console.log(error = e.toString());
                    };
                });
            } catch (e) {
                response = RESPONSE_TYPE.ERROR
                console.log(error = e.toString());
            }

            if(response === RESPONSE_TYPE.SUCCESS) {
                sendgrid.sendCode(email,
                    "Your Verification Code",
                    "{} is your verification code");
                
                res.cookie('session', session, { maxAge: sessionExpiry, httpOnly: true, sameSite: true});
                res.cookie('username', username, { maxAge: sessionExpiry, httpOnly: true, sameSite: true});
                res.cookie('email', email, {maxAge: sessionExpiry, httpOnly: true, sameSite: true});

                res.status(201).json({ status: response, message: error, data: {} });
                return
            } else {
                SERVER_ERROR(res)
                return
            }
        } catch (e) {
            console.log(e.toString())
            SERVER_ERROR(res)
        }
        
        if(!res.headersSent) {
            SERVER_ERROR(res)
        }
    }
}