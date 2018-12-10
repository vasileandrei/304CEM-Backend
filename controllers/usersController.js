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
  const userHash = req.body.usreHash;
  // Check if username is taken
  const userExists = await user.FindByUsername(colName, username);
  if (!userExists) {
    // Create a new hash key
    const newHash = await hash.CreateHash(username, userHash);
    // Construct working object
    const insertObj = {
      username,
      hash: newHash,
      email: req.body.email,
      role: req.body.role,
      deleted: false,
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
      res.status(constants.successAccepted);
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
  let formattedResponse;
  const colName = req.body.colName;
  const username = req.body.username;
  const userHash = req.body.hash;
  const dbUser = await user.FindByUsername(colName, username);
  if (dbUser) {
    // Compare provided password and stored password
    const compare = await hash.compareHash(username, userHash, dbUser.hash);
    if (compare) {
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
      // Send failed response
      formatedResponse = responseUtil.CreateBaseReponse(false, 'Username or password wrong');
      res.status(constants.serverInternalError);
      res.send(formatedResponse);
    }
  } else {
    // Send failed response
    formatedResponse = responseUtil.CreateBaseReponse(false, 'Username or password wrong');
    res.status(constants.serverInternalError);
    res.send(formatedResponse);
  }
};
