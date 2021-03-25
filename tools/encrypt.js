const crypto = require('crypto');

// for securekey
const algorithm = 'aes-256-ctr';
const secretKey = 'sk2jasNUID45NkjaFsnsd83Kkds84ja4';
const iv = '237f306841bd23a418878792252ff6c8';

function decryptKey(key, isAdmin = false) {
  const separator = isAdmin? '!|!': ':|:';
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