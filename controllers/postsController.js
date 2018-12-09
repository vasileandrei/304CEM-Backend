// Document related actions -- User access

const constants = require('../globalConstants');
const posts = require('./../modules/posts');

// Add a new document
// localhost:8080/api/v1/addDoc
module.exports.addOne = function (req, res) {
  const colName = req.body.colName;
  // Create working object
  const reqBody = {};
  Object.keys(req.body).forEach((key) => {
    reqBody[key] = req.body[key];
  });
  reqBody.deleted = false; // set deleted flag false for new entries
  posts.AddToCollection(colName, reqBody, (err) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'POST');
    if (err) {
      // Send failed reponse
      res.status(constants.serverInternalError);
      res.end({
        hasBeenSuccessful: false,
        error: err,
        body: {},
      });
    }
    // Send successful reponse
    res.status(constants.successCreated);
    res.send({
      hasBeenSuccessful: true,
      message: 'Successfully uploaded item ',
      body: {},
    });
  });
};

// Get a document
// localhost:8080/api/v1/getDoc/:id
module.exports.getOne = function (req, res) {
  if (req.body === undefined) req.body = {};
  const colName = req.body.colName;
  const id = req.params.id;
  posts.FindOne(colName, id, (err, post) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'POST');
    if (err) {
      // Send failed reponse
      res.status(constants.serverInternalError);
      res.end({
        hasBeenSuccessful: false,
        error: err,
        body: {},
      });
    }
    if (typeof post === 'string') {
      res.status(constants.clientNotFound);
      res.send({
        hasBeenSuccessful: false,
        message: `No item found for id ${id}`,
        body: {},
      });
    } else {
      // Send successful reponse
      res.status(constants.successAccepted);
      res.send({
        hasBeenSuccessful: true,
        message: `Successfully retreieved item ${post._id}`,
        body: post,
      });
    }
  });
};

// Soft-delete a document (update delete flag to true)
// localhost:8080/api/v1/delDoc/:id
module.exports.softDel = function (req, res) {
  if (req.body === undefined) req.body = {};
  const colName = req.body.colName;
  const id = req.params.id;
  // Initiate database method -- Soft delete document
  posts.UpdateById(colName, id, 'softDelete', (err, result) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'PUT');
    if (err) {
      // Send failed reponse
      res.status(constants.serverInternalError);
      res.end({
        hasBeenSuccessful: false,
        error: err,
        body: {},
      });
    }
    // Send successful reponse
    res.status(constants.successAccepted);
    res.send({
      hasBeenSuccessful: true,
      message: `Successfully soft-deleted item ${result.value._id}`,
      body: { result },
    });
  });
};
