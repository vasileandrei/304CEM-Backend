/* eslint-disable max-lines */
/* eslint-disable no-plusplus */
/* eslint-disable max-lines */
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
 * Find offers where a usser bidded on
 *
 * @param {Array} offerDocs
 * @param {string} username
 * @returns
 */
function findOffersByRequestUser(offerDocs, username) {
  const allOffers = [];
  // For every offer document
  for (let i = 0; i < offerDocs.length; i++) {
    // For every offer in each document
    for (let j = 0; j < offerDocs[i].offers.length; j++) {
      if (offerDocs[i].offers[j].requestUser) {
        offerDocs[i].offers[j].requestUser = offerDocs[i].offers[j].requestUser.toLowerCase();
      }
      // Find the ones where orequestUser === username
      if (offerDocs[i].offers[j].requestUser === username) {
        // Over-write all offers with the latest offer
        offerDocs[i].offers = offerDocs[i].offers[j];
        // Push to list
        allOffers.push(offerDocs[i]);
      }
    }
  }
  return allOffers;
}

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

/**
 * Filter through all the offers and eject the ones that
 * have already been accepted or payed
 *
 * @param {Array} offers
 * @returns {Array} list
 */
function filterOffers(offers) {
  const pendingList = [];
  const acceptedList = [];
  const boughtList = [];

  const acceptedStatus = 'Accepted';
  const pendingStatus = 'Pending';
  const boughtStatus = 'Bought';

  offers.forEach((element) => {
    if (element.offers.length > 0) {
      if (element.offers[0].status === pendingStatus) {
        pendingList.push(element);
      } else if (element.offers[0].status === acceptedStatus) {
        acceptedList.push(element);
      } else if (element.offers[0].status === boughtStatus) {
        boughtList.push(element);
      }
    }
  });
  return [pendingList, acceptedList, boughtList];
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

// Get all offers for user
module.exports.GetAllOffers = function (username, callback) {
  const pendingList = 0;
  const acceptedList = 1;
  const boughtList = 2;
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).find({ authorName: { $regex: `.*${username}.*` } }).toArray((dbErr, result) => {
      if (dbErr) {
        callback(false);
        return;
      }
      const filteredList = filterOffers(result);
      constants.fileLog.info(`Retrieved offers for user ${username}`);
      callback(null, filteredList[pendingList], filteredList[acceptedList], filteredList[boughtList]);
      db.close();
    });
  });
};


// Get all offers for user
module.exports.GetAllMyOffers = function (username, callback) {
  MongoClient.connect(url, { useNewUrlParser: true }, (connErr, db) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    const dbo = db.db(mongo.dbName);
    dbo.collection(collectionName).find({}).toArray((dbErr, result) => {
      if (dbErr) {
        callback(false);
        return;
      }
      const filteredList = findOffersByRequestUser(result, username);
      constants.fileLog.info(`Retrieved all offers from all document, for user ${username}`);
      callback(null, filteredList);
      db.close();
    });
  });
};
