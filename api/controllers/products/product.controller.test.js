const supertest = require('supertest');
const { mongoose } = require('arroyo-erp-models');
const testDB = require('../../../test/test-db')(mongoose);
// const requestLogin = require('../../../test/request-login');
const app = require('../../..');


describe('ProductController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('POST /products/:id/price', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post('/products/ssss/price')
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });
  });
});
