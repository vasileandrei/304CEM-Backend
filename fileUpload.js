/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const express = require('express');
const myCors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const bodyParser = require('body-parser');
// const authCheck = require('./modules/middlewares/tokenMiddleware').AuthToken;
const responseUtil = require('./modules/serviceModels/ResponseUtil');
const constants = require('./globalConstants');
const expires = require('expires');

const port = 8085;

// Cloudinary configuration settings
cloudinary.config({
  cloud_name: constants.cloud_name,
  api_key: constants.api_key,
  api_secret: constants.api_secret,
});

const app = express();
app.use(myCors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cloudinary settings -- store as <data>-<name>.<extension>
//                     -- size limit at <constants.fileSizeLimit>
const storage = cloudinaryStorage({
  cloudinary,
  folder: '304CEM',
  allowedFormats: ['PNG', 'JPG'],
  filename: (req, file, cb) => {
    cb(undefined, `${Date.now()}-${file.originalname}`);
  },
  limists: constants.fileSizeLimit,
});
const parser = multer({ storage });

// localhost:8085/api/v1/files/upload/:username/:email -- Receive file upload requests
// Midleware - Check authentification
//           - Save image in Cloudinary, use <image> as working name
app.post('/api/v1/files/upload', parser.single('image'), (req, res) => {
  let formatedResponse;
  // Set expiration date for file <constants.fileExpire>
  req.body.expires = expires.after(constants.fileExpire);
  req.body.url = req.file.secure_url;
  // console.log(req.body);
  if (req.body.expires !== undefined && req.body.url !== undefined) {
    formatedResponse = responseUtil.CreateDataReponse(true, '', req.body);
    res.status(constants.successCreated);
    res.send(formatedResponse);
  } else {
    formatedResponse = responseUtil.CreateBaseReponse(false, 'File upload failed');
    res.status(constants.serverInternalError);
    res.send(formatedResponse);
  }
});

app.listen(port, () => console.log(`Server started on ${port}`));
