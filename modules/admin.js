// Admin access module

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const constants = require('../globalConstants');

// Construct remote database configuration variables
const mongo = constants.mongoCredentials;
const user = constants.userCredentials;
const url = `mongodb://${user.dbUser}:${user.password}@${mongo.host}:${mongo.port}/${mongo.dbName}`;

let collectionName = 'posts';

module.exports.FindAll = function (colName, callback) {
  if (colName) collectionName = colName;
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).find({}).toArray((dcErr, result) => {
      db.close();
      if (dcErr) {
        callback(dcErr);
        return;
      }
      constants.fileLog.info(`Retrieved all posts for collection ${collectionName}`);
      callback(null, result);
    });
  });
};

module.exports.ForceDelete = function (colName, idReq, callback) {
  if (colName) collectionName = colName;
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).deleteOne({ _id: ObjectID(idReq) }, (dcErr, res) => {
      db.close();
      if (dcErr) {
        callback(dcErr);
        return;
      }
      constants.fileLog.info(`Force Deleted post with id ${idReq} colelction ${collectionName}`);
      callback(null, res);
    });
  });
};
