/* eslint-disable max-lines */

// Files access module

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const constants = require('../globalConstants');
const admin = require('./admin');

// Construct remote database configuration variables
const mongo = constants.mongoCredentials;
const user = constants.userCredentials;
const url = `mongodb://${user.dbUser}:${user.password}@${mongo.host}:${mongo.port}/${mongo.dbName}`;

let collectionName = 'posts';

module.exports.AddToCollection = function (colName, postObj, callback) {
  if (colName) collectionName = colName;
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).insertOne(postObj, (dbErr, res) => {
      db.close();
      if (dbErr) {
        callback(dbErr);
        return;
      }
      constants.fileLog.info(`Created a new post on collection ${collectionName}`);
      callback(null, res);
    });
  });
};

// module.exports.FindSome = function (callback) {
//   MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
//     if (err) {
//       callback(err);
//       return;
//     }
//     const dbo = db.db(mongo.dbName);
//     dbo.collection(mongo.collectionName).find({ deleted: { $eq: false } }).toArray((err, result) => {
//       if (err) {
//         console.log('Error');
//         callback(err);
//         return;
//       }
//       callback(null, result);
//       db.close();
//     });
//   });
// };

module.exports.FindOne = function (colName, id, callback) {
  if (colName) collectionName = colName;
  admin.FindAll(collectionName, (err, list) => {
    if (err) {
      callback(err);
      return;
    }
    // eslint-disable-next-line eqeqeq
    const oneItem = list.find(o => o._id == id);
    if (oneItem) {
      if (!oneItem.deleted) {
        callback(null, oneItem);
      } else {
        callback(null, 'Not Found');
      }
    } else callback(null, 'Not Found');
  });
};

// module.exports.FindSomeByIngredients = function (body, callback) {
//   MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
//     if (err) {
//       callback(err);
//       return;
//     }
//     const dbo = db.db(mongo.dbName);
// eslint-disable-next-line max-len
//     dbo.collection(mongo.collectionName).find({ ingredients: { $regex: `.*${body.query.recipe}.*` }, deleted: { $eq: false } }).toArray((err, result) => {
//       if (err) {
//         console.log('Error');
//         callback(err);
//         return;
//       }
//       callback(null, result);
//       db.close();
//     });
//   });
// };

module.exports.UpdateById = function (colName, id, action, callback) {
  let findById;
  let updateField;
  if (colName) collectionName = colName;
  if (action === 'softDelete') {
    findById = { _id: ObjectID(id) };
    updateField = { $set: { deleted: true } };
  }
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
      if (action === 'softDelete') constants.fileLog.info(`Soft-deleted file ${id}`);
      callback(null, result);
    });
  });
};

module.exports.FindAllPosts = function (colName, callback) {
  if (colName) collectionName = colName;
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).find({ deleted: { $eq: false } }).toArray((dcErr, result) => {
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

module.exports.FindAllPostsById = function (idList, callback) {
  const newIdList = [];
  admin.FindAll(collectionName, (err, list) => {
    if (err) {
      callback(err);
    } else {
      idList.forEach((item) => {
        // eslint-disable-next-line array-callback-return
        const oneItem = list.find((o) => {
          if (String(o._id) === item.postId) newIdList.push(o);
        });
        if (oneItem) {
          if (!oneItem.deleted) {
            newIdList.push(oneItem);
          }
        }
      });
      constants.fileLog.info(`Retrieved all posts for id list: ${newIdList}`);
      callback(null, newIdList);
    }
  });
};
