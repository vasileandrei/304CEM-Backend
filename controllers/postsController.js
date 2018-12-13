// Document related actions -- User access

const constants = require('../globalConstants');
const posts = require('./../modules/posts');
const offer = require('./../modules/offers');
const responseUtil = require('./../modules/serviceModels/ResponseUtil');

// Add a new document
// localhost:8080/api/v1/addDoc
module.exports.addOne = function (req, res) {
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  // Create working object
  const reqBody = {};
  Object.keys(req.body).forEach((key) => {
    reqBody[key] = req.body[key];
  });
  reqBody.price = `${reqBody.price}£`; // set price to default pound
  reqBody.dateCreated = new Date().toLocaleString(); // set upload time
  reqBody.deleted = false; // set deleted flag false for new entries
  // Add one item to the post collection
  posts.AddToCollection(colName, reqBody, (postErr, reponse) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'POST');
    if (postErr) {
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, postErr);
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    } else {
      // If item added successfuly, create an offer document
      const postId = reponse.ops[0]._id;
      offer.CreateOffer(postId, reqBody.authorName, (offerErr) => {
        if (offerErr) {
          // Send failed response
          formatedResponse = responseUtil.CreateBaseReponse(false, offerErr);
          res.status(constants.serverInternalError);
          res.send(formatedResponse);
        } else {
          // Send success response
          const respBody = {
            message: 'Successfully uploaded item',
            result: '',
          };
          formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
          res.status(constants.successCreated);
          res.send(formatedResponse);
        }
      });
    }
  });
};

// Get a document
// localhost:8080/api/v1/getDoc/:id
module.exports.getOne = function (req, res) {
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  const id = req.params.id;
  posts.FindOne(colName, id, (err, post) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'POST');
    if (err) {
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, err);
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    }
    if (typeof post === 'string') {
      formatedResponse = responseUtil.CreateDataReponse(false, `No item found for id ${id}`);
      res.status(constants.clientNotFound);
      res.send(formatedResponse);
    } else {
      // Send success response
      const respBody = {
        message: `Successfully retreieved item ${post._id}`,
        result: post,
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successAccepted);
      res.send(formatedResponse);
    }
  });
};

// Soft-delete a document (update delete flag to true)
// localhost:8080/api/v1/delDoc/:id
module.exports.softDel = function (req, res) {
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  const id = req.params.id;
  // Initiate database method -- Soft delete document
  posts.UpdateById(colName, id, 'softDelete', (err, result) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'PUT');
    if (err) {
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, err);
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    } else {
      // Send successful reponse
      const respBody = {
        message: `Successfully soft-deleted item ${result.value._id}`,
        result,
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successNoContent);
      res.send(formatedResponse);
    }
  });
};

// Find all documents in the collection
// localhost:8080/api/v1/getAllPosts
module.exports.getAllPosts = function (req, res) {
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  // Initiate database method -- Find All
  posts.FindAllPosts(colName, (err, result) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'GET', 'POST');
    if (err) {
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, err);
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    } else {
      // Send success response
      const respBody = {
        message: 'Successfully retreieved items',
        result,
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successAccepted);
      res.send(formatedResponse);
    }
  });
};
