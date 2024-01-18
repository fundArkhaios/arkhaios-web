//create dependencies
const db = require('../util/db');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const aes = require('./aes.js');

module.exports = {
  route: "/api/mfa",
  authenticate: true,
  post: async function(req, res, user) {
    if(!user.mfaVerified) {
      var error = '';
      
      //this is a secret object that is generated from the speakeasy library
      //returns a couple of values: ascii, hex, base32, and otpath_url
      var secret = speakeasy.generateSecret();
      var token = secret.otpauth_url;

      var base32Plain = secret.base32;

      //use AES or another encryption algorithm to encrypt the keys from secret
      var base32Encrypted = await aes.forward(base32Plain);
      var tokenEncrypted = await aes.forward(token);
      
      //we are going to store the secret key in the database for safety
      //try connecting to the database
      try{
        await db.connect(async (db) => {
          //then we need to store the encrypted keys in the data based, so update the user, maybe using cookies
          //here we are checking to see if the user is logged into a valid session and updating the user's info
          await db.collection('Users').updateOne(user,
                                                  {$set: {"mfaVerified": true, "base32Secret": base32Encrypted, "qrCode": tokenEncrypted}});
        })
      }
      catch(e){
        error = e.toString();
      }

      qrcode.toDataURL(token, function(err, url) {
        if(err) {
          res.status(500).json({error: "server error"});
        } else {
          var ret = {token: url, error: error};

          res.status(201).json(ret);
        }
      });
    } else {
      res.status(401).json({error: "mfa already enabled"});
    }
  }
}
