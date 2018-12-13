

const MongoClient = require('mongodb').MongoClient;

const constants = require('../globalConstants');
const config = require('./config');

// Construct remote database configuration variables
const mongo = constants.mongoCredentials;
const user = constants.userCredentials;
const url = `mongodb://${user.dbUser}:${user.password}@${mongo.host}:${mongo.port}/${mongo.dbName}`;

let collectionName = 'users';
const userAccessLevel = 'user';
const adminAccessLevel = 'admin';

module.exports.Register = function (colName, userObj, callback) {
  if (colName) collectionName = colName;
  if (userObj.role === adminAccessLevel) userObj.role = config.accessLevels[`${adminAccessLevel}`];
  else userObj.role = config.accessLevels[`${userAccessLevel}`];
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).insertOne(userObj, (dbErr) => {
      if (dbErr) {
        callback(dbErr);
        return;
      }
      constants.fileLog.info(`Registered new user ${userObj.username}`);
      callback(null);
      db.close();
    });
  });
};

module.exports.FindByUsername = (colName, username) => new Promise((resolve) => {
  if (colName) collectionName = colName;
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      resolve(false);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).find({ username: { $regex: `.*${username}.*` }, deleted: { $eq: false } }).toArray((dbErr, result) => {
      if (dbErr) {
        resolve(false);
        return;
      }
      constants.fileLog.info(`Retrieved information for user ${username}`);
      resolve(result[0]);
      db.close();
    });
  });
});
