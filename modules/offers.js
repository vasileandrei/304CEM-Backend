/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
// Offers access module

const MongoClient = require('mongodb').MongoClient;
const constants = require('../globalConstants');

// Construct remote database configuration variables
const mongo = constants.mongoCredentials;
const userCreds = constants.userCredentials;
const url = `mongodb://${userCreds.dbUser}:${userCreds.password}@${mongo.host}:${mongo.port}/${mongo.dbName}`;

const collectionName = 'offers';

// Document example after an offer has been accepted
// {
//     "_id": {
//         "$oid": "5c105c82abda161cece56bf5"
//     },
//     Post is the id of the post in the posts collection
//     "postId": {
//         "$oid": "5c105c82abda161cece56bf4"
//     },
//     "authorName": null,
//     "offers": [
//         {
//             "id": "1544578914202Pojo",
//             "requestUser": "Pojo",
//             "requestPrice": "20",
//             "requestMessage": "Looks hella awsome",
//             "status": "Accepted"
//         }
//     ]
// }

/**
 * Find the object in offers and uptate the status flag
 *
 * @param {object} offerDoc
 * @param {string} expectedId
 * @returns
 */
function updateObject(offerDoc, expectedId) {
  const foundObj = offerDoc.offers.find((item) => {
    if (item.id === expectedId) return item;
  });
  foundObj.status = 'Accepted';
  return foundObj;
}

// Create a new document in the offers collection
module.exports.CreateOffer = function (postId, authorName, callback) {
  const newOffer = {
    postId: String(postId),
    authorName,
    offers: [],
  };
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).insertOne(newOffer, (dbErr, res) => {
      db.close();
      if (dbErr) {
        callback(dbErr);
        return;
      }
      constants.fileLog.info(`Created an offer document for ${postId}`);
      callback(null, res);
    });
  });
};

// Append a new offer to the offers list in the offers collection
module.exports.AddOffer = function (id, offers, user, callback) {
  const findById = { postId: id };
  const updateField = { $push: { offers } };
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).findOneAndUpdate(findById, updateField, (dbErr, result) => {
      db.close();
      if (dbErr || result.lastErrorObject.n !== 1) {
        callback(dbErr);
        return;
      }
      console.log(result);
      constants.fileLog.info(`Added new offer for ${id}, from ${user}`);
      callback(null, result);
    });
  });
};

// Accept an offer
module.exports.AcceptOffer = function (id, requestId, callback) {
  const findById = { postId: id };
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    // Find the post with all the offers
    dbo.collection(collectionName).findOne((findById), (dbErr, result) => {
      if (dbErr || !result) {
        callback(dbErr);
        return;
      }
      // Send the document format to the util function below, which will return the updated offer object
      const newObject = updateObject(result, requestId);
      // Use the object generated above (status: 'Accepted') and replace the offers list with just this one
      dbo.collection(collectionName).findOneAndUpdate(findById, { $set: { offers: [newObject] } }, (err, response) => {
        db.close();
        if (err || response.lastErrorObject.n !== 1) {
          callback(err);
          return;
        }
        constants.fileLog.info(`Accepted offer for ${id}, by ${response.value.offers[0].requestUser}`);
        callback(null, response);
      });
    });
  });
};
