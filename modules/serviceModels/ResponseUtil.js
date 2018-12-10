// Reponse utility

const BaseResponse = require('../serviceModels/BaseResponse');
const DataResponse = require('./../serviceModels/DataResponse');

/**
 * Create a base response
 *
 * @param {boolean} success
 * @param {err} err
 */
module.exports.CreateBaseReponse = function (success, err) {
  const successfulObj = new BaseResponse();
  successfulObj.hasBeenSuccessful = success;
  successfulObj.errors = err;
  return successfulObj;
};

/**
 * Create a base response -- with content
 *
 * @param {boolean} success
 * @param {err} err
 * @param {string} data
 */
module.exports.CreateDataReponse = function (success, err, data) {
  const successfulObj = new DataResponse();
  successfulObj.hasBeenSuccessful = success;
  successfulObj.errors = err;
  successfulObj.content = data;
  return successfulObj;
};
