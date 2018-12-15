

const MongoClient = require('mongodb').MongoClient;

const constants = require('../globalConstants');

// Construct remote database configuration variables
const mongo = constants.mongoCredentials;
const user = constants.userCredentials;
const url = `mongodb://${user.dbUser}:${user.password}@${mongo.host}:${mongo.port}/${mongo.dbName}`;

let collectionName = 'posts';

module.exports.CreateCollection = function (colName, callback) {
  if (colName) collectionName = colName;
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.createCollection(collectionName, (dbErr, res) => {
      db.close();
      if (dbErr) {
        callback(dbErr);
        return;
      }
      constants.fileLog.info(`Created a new collection ${colName}`);
      callback(null, res);
    });
  });
};

module.exports.DropCollection = function (colName, callback) {
  if (colName) collectionName = colName;
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.dropCollection(collectionName, (dbErr, res) => {
      db.close();
      if (dbErr) {
        callback(dbErr);
        return;
      }
      constants.fileLog.info(`Deleted collection ${colName}`);
      callback(null, res);
    });
  });
};
