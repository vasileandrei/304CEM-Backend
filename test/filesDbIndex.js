/* eslint-disable max-lines */
/* eslint-disable no-console */
/* eslint-disable max-lines */
const axios = require('axios');

module.exports = {
  baseGet() {
    return axios
      .get('http://localhost:8082/api/v1/files/')
      .then(res => res);
  },

  createCollectionPost() {
    return axios
      .post('http://localhost:8082/api/v1/files/createCollection', {
        body: {
          colname: 'mochaTest',
        },
      })
      .then(res => res);
  },

  dropCollectionDelete() {
    return axios
      .post('http://localhost:8082/api/v1/files/dropCollection', {
        body: {
          colname: 'mochaTest',
        },
      })
      .then(res => res);
  },

  getDocPost() {
    return axios
      .post('http://localhost:8082/api/v1/files/getDoc', {
        body: {
          colname: 'mochaTest',
          author: 'mochaTest',
        },
      })
      .then(res => res);
  },

  addDocPost() {
    return axios
      .post('http://localhost:8082/api/v1/files/addDoc', {
        body: {
          colname: 'mochaTest',
          fileTitle: 'mochaTest',
          fileLink: 'http://mochaTest.co.uk/',
          author: 'mochaTest',
        },
      })
      .then(res => res);
  },

  delDocPost() {
    return axios
      .put('http://localhost:8082/api/v1/files/delDoc', {
        body: {
          colname: 'mochaTest',
          fileTitle: 'mochaTest',
        },
      })
      .then(res => res);
  },

  getAllPost() {
    return axios
      .post('http://localhost:8082/api/v1/files/getAll', {
        body: {
          colname: 'mochaTest',
        },
      })
      .then(res => res);
  },

  forceDeleteDelete() {
    return axios
      .post('http://localhost:8082/api/v1/files/forceDelete', {
        body: {
          colname: 'mochaTest',
          fileTitle: 'mochaTest',
        },
      })
      .then(res => res);
  },

  uploadPost() {
    const data = {};
    data.file = {
      fieldname: 'image',
      originalname: 'image2.jpg',
      mimetype: 'image/jpeg',
      destination: './public/uploads',
      size: 301195,
    };
    data.body = {
      colname: 'mochaTest',
      fileTitle: 'mochaTest',
      fileLink: 'http://mochaTest.co.uk/',
      author: 'mochaTest',
    };
    return axios
      .post('http://localhost:8085/api/v1/files/upload', { body: data }, {
        headers: {
          authorization: 'Bearer correctToken',
          contentType: 'multipart/form-data',
        },
      })
      .then(res => res);
  },
};
