const supertest = require('supertest');
const { mongoose, AccountModel } = require('arroyo-erp-models');
const testDB = require('../../../test/test-db')(mongoose);

const app = require('../../..');

const password = 'aabbccdd1234';
const user1 = {
  _id: mongoose.Types.ObjectId(),
  username: 'test',
  password: '$2b$10$oxS7r2ilizQV/uS4q5CPmOmCoTDan4Ed3odWuBnl7fWmTmNOZMzOq',
};

describe('AccountController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('POST /account/login', () => {
    beforeAll(async () => {
      await AccountModel.create(user1);
    });

    describe('No se envía ni usuario ni contraseña', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post('/account/login')
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode).toBe(401);
      });
    });

    describe('Falla porque no se envía contraseña', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post('/account/login')
          .send({ username: user1.username })
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Devería devolver un 401', () => {
        expect(response.status).toEqual(401);
      });
    });

    describe('Envía una contraseña incorrecta', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post('/account/login')
          .send({ username: user1.username, password: 'wrongpassword' })
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Devería devolver un 401', () => {
        expect(response.status).toEqual(401);
      });
    });

    describe('Envía una contraseña correcta', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post('/account/login')
          .send({ username: user1.username, password })
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Devería devolver un 200', () => {
        expect(response.status).toEqual(200);
      });
    });
  });
});
