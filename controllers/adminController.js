// Strinctly admin access controller

const constants = require('./../globalConstants');
const admin = require('./../modules/admin');

// Find all documents in the collection
// localhost:8080/api/v1/getAll
module.exports.getAll = function (req, res) {
  if (req.body === undefined) req.body = {};
  const colName = req.body.colName;
  // Initiate database method -- Find All
  admin.FindAll(colName, (err, result) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'GET', 'POST');
    if (err) {
      // Send failed response
      res.status(constants.serverInternalError);
      res.end({
        hasBeenSuccessful: false,
        error: err,
        body: {},
      });
    }
    // Send success response
    res.status(constants.successAccepted);
    res.send({
      hasBeenSuccessful: true,
      message: 'Successfully retreieved items',
      body: {
        result,
      },
    });
  });
};

// Delete documents from collection
// localhost:8080/api/v1/forceDelete/:id
module.exports.forceDel = function (req, res) {
  if (req.body === undefined) req.body = {};
  const colName = req.body.colName;
  const id = req.params.id;
  // Initiate database method -- Force Delete
  admin.ForceDelete(colName, id, (err) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('accepts', 'DELETE');
    res.end({
      hasBeenSuccessful: false,
      error: err,
      body: {},
    });
    // Send success response
    res.status(constants.successNoContent);
    res.send({
      hasBeenSuccessful: true,
      message: '204 - No content',
      body: {},
    });
  });
};
