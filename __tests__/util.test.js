const util = require('./../modules/util');

describe('checkErrWithReturn', () => {
  test('Succesffuly checkErrorWithReturn no err', async () => {
    expect.assertions(1);
    const myField = '';
    const myBool = true;
    const response = util.checkErrorWithReturn(myField, myBool);
    expect(response).toBe(false);
  });

  test('Succesffuly checkErrorWithReturn test err', async () => {
    expect.assertions(1);
    const myField = new Error('Some Error');
    const myBool = true;
    const response = util.checkErrorWithReturn(myField, myBool);
    expect(response).toBe(true);
  });

  test('Succesffuly checkErrorWithReturn actual err', async () => {
    expect.assertions(1);
    const myField = new Error('SERIOUS TEST Error Something to print here');
    const myBool = false;
    const response = util.checkErrorWithReturn(myField, myBool);
    expect(response).toBe(false);
  });
});

describe('checkErr ', () => {
  test('Succesffuly checkErr no err', async () => {
    const myField = '';
    const myBool = true;
    util.checkErrorWithReturn(myField, myBool);
  });

  test('Succesffuly checkErr test err', async () => {
    const myField = new Error('Some Error');
    const myBool = true;
    util.checkError(myField, myBool);
  });

  test('Succesffuly checkErr actual err', async () => {
    const myField = new Error('SERIOUS TEST Error Something to print here');
    const myBool = false;
    util.checkError(myField, myBool);
  });
});

describe('checkField', () => {
  test('Succesffuly checkField test empty field', async () => {
    const myField = '';
    const myBool = true;
    util.checkField(myField, myBool);
  });

  test('Unsuccesffuly checkField actual empty field', async () => {
    const myField = '';
    const myBool = false;
    util.checkField(myField, myBool);
  });

  test('Unsuccesffuly checkField not empty field', async () => {
    const myField = 'test';
    const myBool = false;
    util.checkField(myField, myBool);
  });
});
