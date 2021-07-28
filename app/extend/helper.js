const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

function mySign(obj) {
  try {
    const { jwtSecret, jwtExpireTime } = this.app.config.jwt;
    return sign(obj, jwtSecret, { expiresIn: jwtExpireTime });
  } catch (e) {
    console.error(e);
  }
}

function myVerify(str) {
  try {
    const { jwtSecret } = this.app.config.jwt;
    return verify(str, jwtSecret);
  } catch (e) {
    console.error(e);
  }
}

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

function saltMd5(str, salt) {
  const defaultSalt = this.app.config.salt;

  return md5(`${str}${salt ?? defaultSalt}`);
}

module.exports = {
  md5,
  saltMd5,
  sign: mySign,
  verify: myVerify,
  lodash,
};
