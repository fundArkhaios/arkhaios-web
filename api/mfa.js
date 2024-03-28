//create dependencies
const db = require('../util/db');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const aes = require('./aes.js');
const { RESPONSE_TYPE } = require('./response_type.js');

module.exports = {
  route: "/api/mfa",
  authenticate: true,
  post: async function(req, res, user) {
    // parameters:
    // {} (e.g., empty): no parameters indicate generation should occur
    // {code: xxxxxx}: a verification code to ensure the user is able to use mfa
    if(!user.mfaVerified || (req.body.code && req.body.disable)) {
      var error = '';
  
      try{
        if(req.body.code) {
          // Client is passing in a code
          if(user.base32Secret && user.qrCode) {
            // Verify code matches secret
            let base32Encrypted = user.base32Secret;

            let base32 = await aes.backward(base32Encrypted);

            let verified = speakeasy.totp.verify({secret: base32,
                                                encoding: 'base32',
                                                token: req.body.code});

            if(verified) {
              await db.updateUser(user, {"mfaVerified": req.body?.disable ? false : true});

              res.status(201).json({status: RESPONSE_TYPE.SUCCESS, message: "mfa enabled"});
            } else {
              res.status(201).json({status: RESPONSE_TYPE.ERROR, message: "Invalid code"});
            }
          } else {
            res.status(201).json({status: RESPONSE_TYPE.ERROR, message: "new secret must be generated"});
          }
        } else {
          //this is a secret object that is generated from the speakeasy library
          //returns a couple of values: ascii, hex, base32, and otpath_url
          var secret = speakeasy.generateSecret({name: "Arkhaios - " + user.email});
          var token = secret.otpauth_url;

          var base32Plain = secret.base32;

          //use AES or another encryption algorithm to encrypt the keys from secret
          var base32Encrypted = await aes.forward(base32Plain);
          var tokenEncrypted = await aes.forward(token);
          
          //we are going to store the secret key in the database for safety
          //try connecting to the database
          
          //then we need to store the encrypted keys in the data based, so update the user, maybe using cookies
          //here we are checking to see if the user is logged into a valid session and updating the user's info
          await db.updateUser(user, {"base32Secret": base32Encrypted, "qrCode": tokenEncrypted});

          // Retrieve QR code image and send to client
          qrcode.toDataURL(token, function(err, url) {
            if(err) {
              res.status(500).json({status: RESPONSE_TYPE.SERVER_ERROR, message: "server error"});
            } else {
              var ret = {status: RESPONSE_TYPE.SUCCESS, message: error, data: {token: url}};

              res.status(201).json(ret);
            }
          });
        }
      } catch(e) {
        error = e.toString();
        
        res.status(401).json({status: RESPONSE_TYPE.SERVER_ERROR, message: "server error"});
      }
    } else {
      res.status(401).json({status: RESPONSE_TYPE.ERROR, message: "mfa already enabled"});
    }
  }
}