// Strinctly admin access controller

const constants = require('./../globalConstants');
const user = require('./../modules/user');
const hash = require('./../modules/hash');
const auth = require('./../modules/auth');
const responseUtil = require('./../modules/serviceModels/ResponseUtil');

// Register a new user
// localhost:8080/api/v1/register
module.exports.register = async function (req, res) {
  // Check req body viability
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  // Check if username is taken
  const userExists = await user.FindByUsername(colName, username);
  if (!userExists) {
    // Create a new hash key
    const newHash = await hash.CreateHash(username, password);
    // Construct working object
    const insertObj = {
      username,
      hash: newHash,
      email: req.body.email,
      role: req.body.role,
      deleted: false,
      favourites: [],
    };
    user.Register(colName, insertObj, (err) => {
      res.setHeader('content-type', 'application/json');
      res.setHeader('accepts', 'POST');
      if (err) {
        // Send failed response
        formatedResponse = responseUtil.CreateBaseReponse(false, err);
        res.status(constants.serverInternalError);
        res.send(formatedResponse);
      }
      // Send success response
      const respBody = {
        message: `Successfully registered user ${username}`,
        result: '',
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successCreated);
      res.send(formatedResponse);
    });
  } else {
    res.send({
      hasBeenSuccessful: false,
      message: `User ${username} is already used`,
      body: {},
    });
  }
};

// Login a user
// localhost:8080/api/v1/login
module.exports.login = async function (req, res) {
  // Check req body viability
  if (req.body === undefined) req.body = {};
  let formatedResponse;
  const colName = req.body.colName;
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  const dbUser = await user.FindByUsername(colName, username);
  if (dbUser) {
    // Compare provided password and stored password
    const compare = await hash.compareHash(username, password, dbUser.hash);
    if (compare === true) {
      // Generate a new token
      const token = await auth.JwtSign(dbUser);
      // Send success response
      const respBody = {
        message: 'User successfuly logged in',
        result: {
          email: dbUser.email,
          username,
          token,
        },
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successAccepted);
      res.send(formatedResponse);
    } else {
    // Send forbidden response
      res.send({ message: 'Username or password wrong' });
    }
  } else {
    // Send failed response
    res.send({ message: 'Username or password wrong' });
  }
};

// Add One to Fav
// localhost:8080/api/v1/addToFav
module.exports.addToFav = function (req, res) {
  let formatedResponse;
  const username = req.body.username;
  const id = req.body.id;
  user.AddToFAv(username, id, (err) => {
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
        message: 'Successfully retreieved items',
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successAccepted);
      res.send(formatedResponse);
    }
  });
};

// Get all favs
// localhost:8080/api/v1/getFavs
module.exports.getFavs = function (req, res) {
  let formatedResponse;
  const username = req.body.username;
  user.GetFavs(username, (err, result) => {
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
        message: 'Successfully retreieved items',
        result,
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successAccepted);
      res.send(formatedResponse);
    }
  });
};

// Get all favs
// localhost:8080/api/v1/delFav
module.exports.delFav = function (req, res) {
  let formatedResponse;
  const username = req.body.username;
  const id = req.body.id;
  user.DelFav(username, id, (err, result) => {
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
        message: 'Successfully retreieved items',
        result,
      };
      formatedResponse = responseUtil.CreateDataReponse(true, '', respBody);
      res.status(constants.successAccepted);
      res.send(formatedResponse);
    }
  });
};
