const BaseResponse = require('./BaseResponse');

// Base reponse constructor -- with content
class DataResponse extends BaseResponse {
  constructor() {
    super();
    this.content = null;
  }
}

module.exports = DataResponse;
