const SimpleNodeLogger = require('simple-node-logger');

// ------------ Log file ------------------------------
// ----------------------------------------------------
const opts = {
  logFilePath: './logs/serverLogs.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
};

// Usage
// <export>.fileLog.info('An informational message!');
// <export>.fileLog.warn('A warning!');
// <export>.fileLog.error('An error!');

module.exports.fileLog = SimpleNodeLogger.createSimpleLogger(opts);
// ----------------------------------------------------


// ------------ HTTP Reponses -------------------------
// ----------------------------------------------------
// Succesful status code
module.exports.successOK = 200;
module.exports.successCreated = 201;
module.exports.successAccepted = 202;
module.exports.successNoContent = 204;

// Client Problem status code
module.exports.clientBadRequest = 400;
module.exports.clientUnauthorized = 401;
module.exports.clientForbidden = 403;
module.exports.clientNotFound = 404;
module.exports.clientMethodNotAllowed = 405;
module.exports.clientConflict = 409;

// Server Problem status code
module.exports.serverInternalError = 500;
module.exports.serverBadGateway = 502;
module.exports.serverGatewayTimeout = 504;
// ----------------------------------------------------


// ------------ Signatures ----------------------------
// ----------------------------------------------------
module.exports.tokenSignature = 'Not implemented';
module.exports.encryptionSignature = 'Not implemented';
// -----------------------------------------------------


// ------------ Token Expiration ----------------------
// ----------------------------------------------------
module.exports.tokenExpireTime = '300m';
// -----------------------------------------------------


// ------------ DB Config -----------------------------
// ----------------------------------------------------
module.exports.userCredentials = {
  dbUser: 'vasilea2',
  password: 'Vasile.1010',
};
// Db Credentials
module.exports.mongoCredentials = {
  host: 'ds141813.mlab.com',
  port: '41813',
  dbName: 'mymongodb',
  collectionName: 'test',
};
// -----------------------------------------------------


// ------------ File Options ------------------------------------
// --------------------------------------------------------------
const biteSize = 1024;
const tenMbLimit = 10;

module.exports.fileExpire = '7 days';
module.exports.fileSizeLimit = biteSize * biteSize * tenMbLimit;
// --------------------------------------------------------------


// ------------ File Options ------------------------------------
// --------------------------------------------------------------
module.exports.cloud_name = 'dpjue1flf';
module.exports.api_key = '343849393888324';
module.exports.api_secret = 'jWZvaE1uYvNpwTWT2AZSCYi-_As';
// --------------------------------------------------------------
