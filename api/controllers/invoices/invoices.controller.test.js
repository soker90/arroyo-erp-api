const supertest = require('supertest');
const { mongoose, InvoiceModel } = require('arroyo-erp-models');
const testDB = require('../../../test/test-db')(mongoose);
const requestLogin = require('../../../test/request-login');
const app = require('../../..');

describe('InvoicesController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /invoices/:id', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/invoices/5ef26172ccfd9d1541b870be')
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

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('El id de la factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .get('/invoices/5ef26172ccfd9d1541b870be')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(response.status)
            .toBe(404);
        });
      });

      describe('Devuelve los datos de la factura ', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({})
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .get(`/invoices/${invoice._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', async () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(200);
        });
      });
    });
  });
});
