// Offer related actions -- User access

const constants = require('../globalConstants');
const offers = require('./../modules/offers');
const responseUtil = require('./../modules/serviceModels/ResponseUtil');

// Add a new Offer
// localhost:8080/api/v1/addOffer
module.exports.addOffer = function (req, res) {
  const date = new Date().getTime();
  const id = req.body.postId;
  const offer = {
    id: `${date}${req.body.username}`,
    requestUser: req.body.username,
    requestPrice: `${req.body.price}£`,
    requestMessage: req.body.message,
    status: 'Pending',
  };
  offers.AddOffer(id, offer, (err) => {
    let formatedResponse;
    if (err) {
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, err);
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    } else {
      // Send success response
      const respBody = {
        message: 'Successfully added offer',
        result: '',
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successCreated);
      res.send(formatedResponse);
    }
  });
};

// Accept an offer
// localhost:8080/api/v1/acceptOffer
module.exports.acceptOffer = function (req, res) {
  const id = req.body.postId;
  const offerId = req.body.offerId;
  offers.AcceptOffer(id, offerId, (err) => {
    let formatedResponse;
    if (err) {
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, err);
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    } else {
      // Send success response
      const respBody = {
        message: 'Successfully accepted offer',
        result: '',
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successCreated);
      res.send(formatedResponse);
    }
  });
};
