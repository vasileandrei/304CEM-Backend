const db = require('./../modules/database');

const req = {
  body: {
    colname: 'unitTest',
  },
};

describe('CreateCollection', () => {
  test('Succesffuly creating a collection', async (done) => {
    expect.assertions(1);
    try {
      const newTableName = req.body.colname;
      const url = 'defaultURL';
      db.CreateCollection(newTableName, url, (data) => {
        expect(data).toBeNull();
        done();
      });
    } catch (err) {
      console.log(`err is ${err.message}`);
    }
  });

  test('Failing to create a collection', async (done) => {
    expect.assertions(1);
    try {
      const newTableName = req.body.colname;
      const url = 'fail';
      db.CreateCollection(newTableName, url, () => {});
    } catch (err) {
      expect(err.message).toBe('Cannot read property \'db\' of null');
      console.log(`err is ${err.message}`);
      done();
    }
  });
});

describe('DropCollection', () => {
  test('Succesffuly dropping a collection', async (done) => {
    expect.assertions(1);
    try {
      const newTableName = req.body.colname;
      const url = 'defaultURL';
      db.DropCollection(newTableName, url, (data) => {
        expect(data).toBeNull();
        done();
      });
    } catch (err) {
      console.log(`err is ${err.message}`);
    }
  });
});
