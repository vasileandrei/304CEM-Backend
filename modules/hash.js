
const crypto = require('crypto');
const constants = require('./../globalConstants');

/**
 * Create a hash based on 'username password'
 * encrypted sha256, stored hex
 *
 * @param {Request} req
 */
module.exports.CreateHash = (username, password) => new Promise((resolve) => {
  // Create sha256 encryption
  const hmac = crypto.createHmac('sha256', constants.encryptionSignature);
  hmac.write(`${username} ${password}`);
  hmac.end();
  const hash = hmac.read().toString('hex');
  constants.fileLog.info(`Created new Hash for user ${username}`);
  resolve(hash);
});

/**
 * Used for Login page
 * Compare req username/password with SQL Hash
 *
 * @param {Request} req
 */
module.exports.compareHash = (username, password, dbHash) => new Promise((resolve) => {
  // Create sha256 encryption -- request username
  const userHmac = crypto.createHmac('sha256', constants.encryptionSignature);
  userHmac.write(`${username} ${password}`);
  userHmac.end();
  const userHash = userHmac.read().toString('hex');
  constants.fileLog.info(`Comparing hash for user ${username}`);
  // Compare request credentials with store credentials
  if (userHash === dbHash) resolve(true);
  else resolve(false);
});
