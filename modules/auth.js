const jwt = require('jsonwebtoken');

const constants = require('./../globalConstants');

/**
 * Javascript Web Token Signer
 * hashToken to jwtSigned string
 *
 * @param {String} hashToken
 */
module.exports.JwtSign = info => new Promise((resolve) => {
  // Construct working obj -- Token payload
  const userInfo = {
    username: info.username,
    email: info.email,
    role: info.role,
  };
  // Sign token using secret signatrure
  jwt.sign({ userInfo }, constants.tokenSignature, { expiresIn: constants.tokenExpireTime }, (_, token) => {
    constants.fileLog.info(`Signing a new token for ${userInfo.username} token. Expires in 300m`);
    resolve(token);
  });
});
