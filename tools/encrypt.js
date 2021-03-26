const crypto = require('crypto');
const { algorithm, secretKey, iv } = require('../config/encrypt.json');

function decryptKey(key) {
  const separator = ':|:';
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(key, 'hex')), decipher.final()]);
  const keyData = decrpyted.toString().split(separator);
  return {
    userId: keyData[0],
    expiry: keyData[1],
    username: keyData[2]
  };
}

module.exports = {
  decryptKey
};