const crypto = require('crypto');
const pepp = process.env.PEPPER;

//pre-condition: parameters are as follows{
//               plain: plaintext string that is needed to be hashed
//               salt: the user salt from the database, if no salt in DB, just input ''
//               iterations: the user iterations in the database, if no iter in DB, just input 0
//}
//post-condition: the following are returned:{
//                hashed string
//                salt
//                iterations
//}

//a function to just generate a random salt
function generateSalt() {
    return crypto.randomBytes(128).toString('base64');
}

//a function to generate a random iteration
function generateIter() {
    //this will generate a random int from 1,000 - 10,000
    return Math.floor(Math.random() * 9001) + 1000;
}

module.exports = {
    hash: function(plain, salt, iterations){
        //this is checking to see if the user already has a generated salt
        var tempSalt = salt;
        if(!salt) tempSalt = generateSalt();

        //same thing, except for checking for amount of iterations for the SHA512
        var tempIter = iterations;
        if(!iterations) tempIter = generateIter();

        //call the password-based key derivation function with pepper prepended to the plaintext, 64bit keyspace and SHA512 as the algo
        var result = crypto.pbkdf2Sync(pepp + plain, tempSalt, tempIter, 64, 'sha512');
       
        //this returns 3 things, the hashed string, salt, and iterations
        return {
            hashed: result.toString('hex'), 
            salt: tempSalt, 
            iter: tempIter
        };
    }
}
