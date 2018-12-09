
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
