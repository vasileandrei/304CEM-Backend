/* eslint-disable no-underscore-dangle */
/* eslint-disable no-magic-numbers */
/* eslint-disable import/no-unresolved */

const users = require('./../modules/users');

const req = {
  body: {
    username: 'test',
  },
};

const colName = 'files123';
let newCollectionId = '';

describe('AddOneToCollection', () => {
  test('Succesffuly adding a document to a collection', async (done) => {
    expect.assertions(3);
    try {
      req.body.colName = colName;
      const reqBody = {};
      Object.keys(req.body).forEach((key) => {
        reqBody[key] = req.body[key];
      });
      reqBody.deleted = false; // set deleted flag false for new entries
      const url = 'defaultURL';
      users.AddOneToCollection(reqBody, url, (err, data) => {
        expect(err).toBeNull();
        expect(data.result.ok).toEqual(1);
        expect(data.result.n).toEqual(1);
        newCollectionId = data.ops[0]._id;
        done();
      });
    } catch (err) {
      console.log(`err is ${err.message}`);
    }
  });
});

describe('GetOne', () => {
  test('Succesffuly retrieving a document from a collection', async (done) => {
    expect.assertions(2);
    try {
      req.body.colName = colName;
      const url = 'defaultURL';
      users.FindOne(req, url, (err, data) => {
        expect(err).toBeNull();
        expect(data[0].username).toEqual(req.body.username);
        done();
      });
    } catch (err) {
      console.log(`err is ${err.message}`);
    }
  });
});

describe('SoftDelete', async () => {
  test('Succesffuly soft-deleting a document from a collection', async (done) => {
    expect.assertions(3);
    try {
      req.body._id = newCollectionId;
      req.body.colName = colName;
      const url = 'defaultURL';
      users.SoftDelete(req, url, (err, data) => {
        expect(err).toBeNull();
        expect(data.ok).toBe(1);
        expect(data.value).toBe(null); // deleted is true
        done();
      });
    } catch (err) {
      console.log(`err is ${err.message}`);
    }
  });
});
