// Collection related actions module -- Admin access

const constants = require('../globalConstants');
const db = require('../modules/database');

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
  const colName = req.body.colName;
  // Initiate database method -- Create collection
  db.CreateCollection(colName, (err) => {
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
      message: `Created a new collection ${colName}`,
      body: {},
    });
  });
};

// Delete a collection -- Admin access
// localhost:8080/api/v1/dropCollection
module.exports.dropCollectionDel = function (req, res) {
  // Check req body viability
  const colName = req.body.colName;
  // Initiate database method -- Delete collection
  db.DropCollection(colName, (err) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'DELETE');
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
    res.status(constants.successNoContent);
    res.send({
      hasBeenSuccessful: true,
      message: `Deleted a collection ${colName}`,
      body: {},
    });
  });
};
