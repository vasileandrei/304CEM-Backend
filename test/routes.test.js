/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-lines */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-magic-numbers */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const nock = require('nock');

const dbIndex = require('./filesDbIndex');
const response = require('./response');

describe('FilesApi http://localhost:8082', () => {
  it('/GET /api/v1/files/', () => {
    nock('http://localhost:8082')
      .get('/api/v1/files/')
      .reply(200, response.baseGet);
    return dbIndex.baseGet()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(200);
        expect(res.data.body.message).to.equal('Hello from baseGet, FilesController');
        expect(res.data.redirect).to.equal(false);
      });
  });

  it('/POST /api/v1/files/', () => {
    nock('http://localhost:8082')
      .post('/api/v1/files/createCollection', {
        body: {
          colname: 'mochaTest',
        },
      })
      .reply(201, response.createCollectionPost);
    return dbIndex.createCollectionPost()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(201);
        expect(res.data.body.message).to.equal('Created a new collection mochaTest');
        expect(res.data.redirect).to.equal(false);
      });
  });

  it('/DELETE /api/v1/files/', () => {
    nock('http://localhost:8082')
      .post('/api/v1/files/dropCollection', {
        body: {
          colname: 'mochaTest',
        },
      })
      .reply(204, response.dropCollectionDelete);
    return dbIndex.dropCollectionDelete()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(204); // 204 No Content
        expect(res.data.body.message).to.equal('');
        expect(res.data.redirect).to.equal(false);
      });
  });
});

describe('UsersAPI http://localhost:8082', () => {
  it('/POST /api/v1/files/getDoc', () => {
    const expectedRes = {
      _id: '5be9ef05ebeb4807ecd8f82d',
      colname: 'mochaTest',
      fileTitle: 'mochaTest',
      fileLink: 'http://mochaTest.co.uk/',
      author: 'mochaTest',
      deleted: false,
    };
    nock('http://localhost:8082')
      .post('/api/v1/files/getDoc', {
        body: {
          colname: 'mochaTest',
          author: 'mochaTest',
        },
      })
      .reply(200, response.getDocPost);
    return dbIndex.getDocPost()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(200);
        expect(res.data.body[0]._id).to.equal(expectedRes._id);
        expect(res.data.body[0].colname).to.equal(expectedRes.colname);
        expect(res.data.body[0].fileTitle).to.equal(expectedRes.fileTitle);
        expect(res.data.body[0].fileLink).to.equal(expectedRes.fileLink);
        expect(res.data.body[0].author).to.equal(expectedRes.author);
        expect(res.data.body[0].deleted).to.equal(expectedRes.deleted);
        expect(res.data.redirect).to.equal(false);
      });
  });

  it('/POST /api/v1/files/addDoc', () => {
    nock('http://localhost:8082')
      .post('/api/v1/files/addDoc', {
        body: {
          colname: 'mochaTest',
          fileTitle: 'mochaTest',
          fileLink: 'http://mochaTest.co.uk/',
          author: 'mochaTest',
        },
      })
      .reply(201, response.addDocPost);
    return dbIndex.addDocPost()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(201);
        expect(res.data.body.message).to.equal('Successfully uploaded');
        expect(res.data.redirect).to.equal(false);
      });
  });

  it('/PUT /api/v1/files/delDoc', () => {
    nock('http://localhost:8082')
      .put('/api/v1/files/delDoc', {
        body: {
          colname: 'mochaTest',
          fileTitle: 'mochaTest',
        },
      })
      .reply(204, response.delDocPost);
    return dbIndex.delDocPost()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(204); // 204 No Content
        expect(res.data.body.message).to.equal('');
        expect(res.data.body.deleted).to.equal(true);
        expect(res.data.redirect).to.equal(false);
      });
  });

  it('/POST   /api/v1/files/upload', () => {
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
    nock('http://localhost:8085')
      .post('/api/v1/files/upload', { body: data }, {
        reqheaders: {
          authorization: 'Bearer correctToken',
          contentType: 'multipart/form-data',
        },
      })
      .reply(201, response.uploadPost);
    return dbIndex.uploadPost()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(201);
        expect(res.data.body.hasBeenSuccessful).to.equal(true);
        expect(res.data.body.errors).to.equal('');
        expect(res.data.body.redirect).to.equal('http://localhost:8082/api/v1/files/addDoc');
        expect(res.data.body.content.message).to.equal('File has been succesfully uploaded');
        expect(res.data.file.originalname).to.equal('image2.jpg');
        expect(res.data.file.path).to.equal('public\\uploads\\1542463186053-image2.jpg');
        expect(res.data.header.authorization).to.equal('Bearer correctToken');
        expect(res.data.header.contentType).to.equal('multipart/form-data');
      });
  });
});

describe('AdminAPI http://localhost:8082', () => {
  it('/POST /api/v1/files/getAll', () => {
    const expectedRes = [{
      _id: '5be9ef05ebeb4807ecd8f82d',
      colname: 'mochaTest',
      fileTitle: 'mochaTest',
      fileLink: 'http://mochaTest.co.uk/',
      author: 'mochaTest',
      deleted: false,
    }, {
      _id: '4be9ef05ebeb4807ecd8f82d',
      colname: 'mochaTest',
      fileTitle: 'mochaTest1',
      fileLink: 'http://mochaTest1.co.uk/',
      author: 'mochaTest',
      deleted: true,
    }];
    nock('http://localhost:8082')
      .post('/api/v1/files/getAll', {
        body: {
          colname: 'mochaTest',
        },
      })
      .reply(200, response.getAllPost);
    return dbIndex.getAllPost()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(200);
        expect(res.data.body[0]._id).to.equal(expectedRes[0]._id);
        expect(res.data.body[0].colname).to.equal(expectedRes[0].colname);
        expect(res.data.body[0].fileTitle).to.equal(expectedRes[0].fileTitle);
        expect(res.data.body[0].fileLink).to.equal(expectedRes[0].fileLink);
        expect(res.data.body[0].author).to.equal(expectedRes[0].author);
        expect(res.data.body[0].deleted).to.equal(expectedRes[0].deleted);
        expect(res.data.body[1]._id).to.equal(expectedRes[1]._id);
        expect(res.data.body[1].colname).to.equal(expectedRes[1].colname);
        expect(res.data.body[1].fileTitle).to.equal(expectedRes[1].fileTitle);
        expect(res.data.body[1].fileLink).to.equal(expectedRes[1].fileLink);
        expect(res.data.body[1].author).to.equal(expectedRes[1].author);
        expect(res.data.body[1].deleted).to.equal(expectedRes[1].deleted);
        expect(res.data.redirect).to.equal(false);
      });
  });

  it('/DELETE /api/v1/files/forceDelete', () => {
    nock('http://localhost:8082')
      .post('/api/v1/files/forceDelete', {
        body: {
          colname: 'mochaTest',
          fileTitle: 'mochaTest',
        },
      })
      .reply(204, response.forceDeleteDelete);
    return dbIndex.forceDeleteDelete()
      .then((res) => {
        expect(typeof res).to.equal('object');
        expect(res.data.status).to.equal(204); // 204 No Content
        expect(res.data.body.message).to.equal('');
        expect(res.data.redirect).to.equal(false);
      });
  });
});
