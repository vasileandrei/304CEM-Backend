// Strinctly admin access controller

const constants = require('./../globalConstants');
const user = require('./../modules/user');
const hash = require('./../modules/hash');
const auth = require('./../modules/auth');

// Register a new user
// localhost:8080/api/v1/register
module.exports.register = async function (req, res) {
  // Check req body viability
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
        message: `Successfully registered user ${username}`,
        body: {},
      });
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
      res.status(constants.successAccepted);
      res.send({
        hasBeenSuccessful: true,
        message: 'User successfuly logged in',
        body: {
          email: dbUser.email,
          username,
          token,
          message: `Welcome back, ${dbUser.username}`,
        },
      });
    } else {
      // Send faield response
      res.status(constants.clientNotFound);
      res.send({
        hasBeenSuccessful: false,
        message: 'Username or password is wrong',
        body: {},
      });
    }
  } else {
    // Send faield response
    res.status(constants.clientNotFound);
    res.send({
      hasBeenSuccessful: false,
      message: 'Username or password is wrong',
      body: {},
    });
  }
};
