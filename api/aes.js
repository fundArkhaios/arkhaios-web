const aesjs = require('aes-js');

key = []
for(let i = 0; i < 32; ++i) {
  key[i] = i;
}

module.exports = {
  forward: async function(plain){
    var plainBytes = aesjs.utils.utf8.toBytes(plain);

    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(plainBytes);

    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    return encryptedHex;
  },

  backward: async function(cipher){
    var encryptedBytes = aesjs.utils.hex.toBytes(cipher);

    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

    return decryptedText;
  }
}