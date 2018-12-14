/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */

const MongoMock = require('mongomock');

const db = {
  files: [
    {
      _id: '5c03daa82f3077348453141e',
      username: 'myuser',
      email: 'myUser@user.co.uk',
      url: 'https://res.cloudinary.com/dpjue1flf/image/upload/v1543756455/340CT/1543756454528-image1.jpg.jpg',
      expires: 1544361256384,
      colName: 'files',
      deleted: false,
    },
    {
      _id: '5c03daa82f307',
      username: 'myuser',
      email: 'myUser@user.co.uk',
      url: 'https://res.cloudinary.com/dpjue1flf/image/upload/v1543756455/340CT/1543756454528-image1.jpg.jpg',
      expires: 1544361256384,
      colName: 'files',
      deleted: true,
    },
    {
      _id: '5c03db032f3077348453141f',
      username: 'admin',
      email: 'admin@gmail.com',
      url: 'https://res.cloudinary.com/dpjue1flf/image/upload/v1543756546/340CT/1543756545596-image1.jpg.jpg',
      expires: 1544361347506,
      colName: 'files',
      deleted: false,
    },
  ],
};

describe('Retrieving documents', () => {
  test('Getting a doc by user', () => {
    expect.assertions(1);
    const mongo = new MongoMock(db);
    mongo.collection('files').find({ username: 'myuser' }).toArray((err, doc) => {
      if (err) console.error(err.message);
      expect(doc).toEqual([db.files[0], db.files[1]]);
    });
  });

  test('Getting a doc by user and not deleted', () => {
    expect.assertions(1);
    const mongo = new MongoMock(db);
    const query = { username: 'myuser', deleted: false };
    mongo.collection('files').find(query).toArray((err, doc) => {
      if (err) console.error(err.message);
      expect(doc).toEqual([db.files[0]]);
    });
  });

  test('Getting a doc by id', () => {
    expect.assertions(1);
    const mongo = new MongoMock(db);
    mongo.collection('files').find({ _id: '5c03db032f3077348453141f' }).toArray((err, doc) => {
      if (err) console.error(err.message);
      expect(doc).toEqual([db.files[2]]);
    });
  });

  test('Getting all docs', () => {
    expect.assertions(1);
    const mongo = new MongoMock(db);
    mongo.collection('files').find().toArray((err, doc) => {
      if (err) console.error(err.message);
      expect(doc).toEqual([db.files[0], db.files[1], db.files[2]]);
    });
  });
});

describe('Appening documents', () => {
  test('Appening a document', () => {
    expect.assertions(1);
    const mongo = new MongoMock(db);
    const obj = {
      _id: 'test',
      username: 'test',
      email: 'test@gmail.com',
      url: 'https://res.cloudinary.com/dpjue1flf/image/upload/v1543756546/340CT/1543756545596-test.jpg.jpg',
      expires: 1544361347506,
      colName: 'files',
      deleted: false,
    };
    mongo.collection('files').insert((obj), (err, data) => {
      if (err) console.error(err.message);
      expect(data).toEqual(obj);
    });
  });
});

describe('Updating a document', () => {
  test('Updating a document using findAndModify', () => {
    expect.assertions(1);
    const mongo = new MongoMock(db);
    mongo.collection('files').findAndModify({ _id: '5c03daa82f307' }, '$set', { deleted: true }, (err, data) => {
      if (err) console.error(err.message);
      expect(data.deleted).toEqual(true);
    });
  });

  test('Updating a document using update', () => {
    expect.assertions(1);
    const mongo = new MongoMock(db);
    mongo.collection('files').update({ _id: '5c03daa82f307' }, '$set', { deleted: true }, (err, data) => {
      if (err) console.error(err.message);
      console.log(data);
      expect(data).toEqual(1);
    });
  });
});
