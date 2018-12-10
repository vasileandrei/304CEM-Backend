// Document related actions -- User access

const constants = require('../globalConstants');
const posts = require('./../modules/posts');
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
  reqBody.deleted = false; // set deleted flag false for new entries
  posts.AddToCollection(colName, reqBody, (err) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'POST');
    if (err) {
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, err);
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    } else {
      // Send success response
      const respBody = {
        message: 'Successfully uploaded item',
        result: '',
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successNoContent);
      res.send(formatedResponse);
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
      res.status(constants.successNoContent);
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
      res.status(constants.successAccepted);
      res.send(formatedResponse);
    }
  });
};
