const supertest = require('supertest');
const { mongoose, AccountModel } = require('arroyo-erp-models');
const testDB = require('../../../test/test-db')(mongoose);

const app = require('../../..');

describe('AccountController', () => {
  beforeAll(() => testDB.connect());

  afterAll(() => testDB.disconnect());
  describe('auth()', () => {
    describe('Password missing', () => {
      afterAll(
        test('It should reject an error due to missing params issue', (done) => {
          supertest(app).post('/account/auth').then(error => {
            expect(error.statusCode).toBe(401);
            done();
          });
        }),
      );
    });
  });
});
