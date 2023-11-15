//create dependencies
const db = require('../db');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const authenticate = require('../authenticate');
const aes = require('./aes.js');

module.exports = {
  keyGeneration: async function(req, res){
    var error = '';
    
    //this is a secret object that is generated from the speakeasy library
    //returns a couple of values: ascii, hex, base32, and otpath_url
    var secret = speakeasy.generateSecret();
    var token = secret.otpauth_url;

    var base32Plain = secret.base32;

    //use AES or another encryption algorithm to encrypt the keys from secret
    var base32Encrypted = aes.forward(base32Plain);
    var tokenEncrypted = aes.forward(token);

    //we need to grab the cookie to connect to the database
    const { user , session } = req.cookies;
    
    //we are going to store the secret key in the database for safety
    //try connecting to the database
    try{
      await db.connect(async (db) => {
        //then we need to store the encrypted keys in the data based, so update the user, maybe using cookies
         const results = await authenticate.login(user, session);

        //here we are checking to see if the user is logged into a valid session and updating the user's info
        if(results != undefined){
          await db.collection('Users').updateOne({"id":user},
                                                 {$push: {"base32Secret": base32Encrypted, "qrCode": tokenEncrypted}});
        }
      })
    }
    catch(e){
      error = e.toString();
    }

    var ret = {token: token, error: error};

    res.status(201).json(ret);
  }
}