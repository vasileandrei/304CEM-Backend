/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */

const MongoMock = require('mongomock');

const db = {files: [{test: '112233'}]};

describe('Creating a new collection', () => {
  test('Creating a new one', () => {
    expect.assertions(1);
    const colName = 'test123';
    const mongo = new MongoMock(db);
    mongo.collection('files').save(colName, (err, doc) => {
      if (err) console.error(err.message);
      expect(doc).toEqual(colName);
    });
  });
});

describe('Deleting a collection', () => {
  test('Deleting one', () => {
    expect.assertions(1);
    const colName = undefined;
    const mongo = new MongoMock(db);
    mongo.collection('files').remove(colName, (err, doc) => {
      if (err) console.error(err.message);
      expect(doc).toEqual(colName);
    });
  });
});
