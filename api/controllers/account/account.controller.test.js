const supertest = require('supertest');

const app = require('../../..');

describe('AccountController', () => {
  describe('auth()', () => {
    describe('Password missing', () => {
      afterAll(
        test('It should reject an error due to missing params issue', (done) => {
          supertest(app).post('/account/auth').then(error => {
            expect(error.statusCode).toBe(401);
            done();
          });
        }));
    });
  });
});
