/* eslint-disable max-len */

const MongoClient = require('mongodb').MongoClient;

const constants = require('../globalConstants');
const config = require('./config');
const admin = require('./admin');

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

module.exports.AddToFAv = function (username, id, callback) {
  const findById = { username };
  const updateField = { $push: { favourites: id } };
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).findOneAndUpdate(findById, updateField, (dbErr) => {
      db.close();
      if (dbErr) {
        callback(dbErr);
        return;
      }
      constants.fileLog.info(`Added a post to favourite for id ${id}`);
      callback(null);
    });
  });
};

module.exports.GetFavs = function (username, callback) {
  let tmpList = [];
  admin.FindAll(collectionName, (err, result) => {
    if (err) {
      callback(err);
      return;
    }
    result.forEach((element) => {
      if (element.username === username) {
        if (!element.favourites) element.favourites = [];
        tmpList = element.favourites;
      }
    });
    constants.fileLog.info(`Got all favourites for ${username}`);
    callback(null, tmpList);
  });
};

module.exports.DelFav = function (username, id, callback) {
  const findById = { username };
  const updateField = { $pull: { favourites: id } };
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).findOneAndUpdate(findById, updateField, (dbErr, result) => {
      db.close();
      if (dbErr) {
        callback(dbErr);
        return;
      }
      console.log(result);
      constants.fileLog.info(`Removed a post from favourite for id ${id}`);
      callback(null);
    });
  });
};
