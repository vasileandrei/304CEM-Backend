// Collection related actions module -- Admin access

const constants = require('../globalConstants');
const db = require('../modules/database');
const responseUtil = require('./../modules/serviceModels/ResponseUtil');

// localhost:8080/api/v1/ -- Test route
module.exports.baseGet = function (req, res) {
  res.status(constants.successOK);
  res.send({
    hasBeenSuccessful: true,
    message: 'Hello from baseGet, FilesController',
    body: {},
  });
};

// Create a new collection -- Admin access
// localhost:8080/api/v1/createCollection
module.exports.createCollectionPost = function (req, res) {
  // Check req body viability
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  // Initiate database method -- Create collection
  db.CreateCollection(colName, (err) => {
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
        message: `Created a new collection ${colName}`,
        result: '',
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successCreated);
      res.send(formatedResponse);
    }
  });
};

// Delete a collection -- Admin access
// localhost:8080/api/v1/dropCollection
module.exports.dropCollectionDel = function (req, res) {
  // Check req body viability
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  // Initiate database method -- Delete collection
  db.DropCollection(colName, (err) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'DELETE');
    if (err) {
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, err);
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    } else {
      // Send success response
      const respBody = {
        message: `204 - Deleted a collection ${colName}`,
        result: 'No Content',
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successNoContent);
      res.send(formatedResponse);
    }
  });
};
