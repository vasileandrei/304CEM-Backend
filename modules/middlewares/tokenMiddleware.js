// Authentification midleware

const jwt = require('jsonwebtoken');
const reponseUtil = require('./../serviceModels/ResponseUtil');
const constants = require('./../../globalConstants');
const config = require('./../config');

/**
 * Util unc to send client Unauthorized
 *
 * @param {*} res
 */
function sendUnauthorized(res) {
  // eslint-disable-next-line no-magic-numbers
  res.status(403);
  const forbiddenResponse = reponseUtil.CreateBaseReponse(false, 'Not authorized. Token missing or wrong');
  res.send(forbiddenResponse);
}

/**
 * Compare token from response against
 * the secret signature
 *
 * @param {String} token
 * @param {Response} res
 */
function checkSignature(token, res) {
  // Verify the jwt token
  jwt.verify(token, constants.tokenSignature, (err) => {
    if (err) {
      sendUnauthorized(res);
    }
    constants.fileLog.info('Signature succesfully vertified');
  });
}

/**
 * Check Admin Permission Level
 *
 * @param {number} accessLevel
 * @param {callback} callback
 */
module.exports.checkAdminRole = function (req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const tokenIndex = 1;
    // Split the token by space (typical token is :'Bearer tokenHere')
    const decoded = jwt.decode(bearerHeader.split(' ')[tokenIndex]);
    if (!(decoded.userInfo.role <= config.accessLevels.admin)) sendUnauthorized(res);
    else {
      constants.fileLog.info('Permission level succesfully vertified');
      next();
    }
  } else {
    sendUnauthorized(res);
  }
};

/**
 * Auth Midleware
 * Checks User Token
 *
 * @param {Request} req
 * @param {number} level
 * @param {Response} res
 * @param {next} next
 */
module.exports.AuthToken = function (req, res, next) {
  const bearerHeader = req.headers.authorization;
  // check for x-www-form-urlencoded' as well
  if (typeof bearerHeader !== 'undefined') {
    const tokenIndex = 1;
    // Split the token by space (typical token is :'Bearer tokenHere')
    const bearerToken = bearerHeader.split(' ')[tokenIndex];
    checkSignature(bearerToken, res);
    next();
  } else {
    sendUnauthorized(res);
  }
};
