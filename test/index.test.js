const supertest = require('supertest');

const app = require('..');

describe('api', () => {
  describe('/monit/health', () => {
    test('It should resolves with a success response', done => {
      supertest(app)
        .get('/monit/health')
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
  });
});
