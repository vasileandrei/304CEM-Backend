// Strinctly admin access controller

const constants = require('./../globalConstants');
const admin = require('./../modules/admin');
const responseUtil = require('./../modules/serviceModels/ResponseUtil');

// Find all documents in the collection
// localhost:8080/api/v1/getAll
module.exports.getAll = function (req, res) {
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  // Initiate database method -- Find All
  admin.FindAll(colName, (err, result) => {
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

// Delete documents from collection
// localhost:8080/api/v1/forceDelete/:id
module.exports.forceDel = function (req, res) {
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  const id = req.params.id;
  // Initiate database method -- Force Delete
  admin.ForceDelete(colName, id, (err) => {
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
        message: '204 - Successfully deleted',
        result: 'No Content',
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successNoContent);
      res.send(formatedResponse);
    }
  });
};
