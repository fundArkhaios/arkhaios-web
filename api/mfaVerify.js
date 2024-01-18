const speakeasy = require('speakeasy');
const aes = require('./aes.js');

module.exports = {
    method: "GET",
    router: "/api/mfaVerify",
    authenticate: true,
    api: async function(req, res, usr) {
        var { usrToken } = req.body;
        var base32Encrypted = usr.base32Secret;

        var base32 = aes.backward(base32Encrypted);

        var verified = speakeasy.totp.verify({secret: base32,
                                              encoding: 'base32',
                                              token: usrToken});

        if(verified)
            res.status(200).json({token: verified});

        res.status(401).json({token: verified, err: "Something went wrong."});
    }
}
