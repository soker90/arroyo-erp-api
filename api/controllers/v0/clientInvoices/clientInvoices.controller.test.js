const supertest = require('supertest');
const {
  mongoose,
  ClientModel,
  ClientInvoiceModel,
} = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const {
  commonErrors,
  invoiceErrors,
  clientErrors,
} = require('../../../../errors');

const invoiceMock = {
  total: 295.74,
  date: 1594474393373.0,
  nInvoice: '22/2020',
};

describe('ClientInvoicesController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('POST /client/invoices', () => {
    const PATH = '/client/invoices';
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(PATH)
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

      describe('El cliente no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .send({
              client: '5f7e138c15e88854b95b3cad',
            })
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();
          expect(response.status)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new clientErrors.ClientIdNotFound().message);
        });
      });

      describe('Se crea la factura correctamente', () => {
        let response;
        let client;

        before(() => ClientModel.create({
          name: 'Cliente',
        })
          .then(clientCreated => {
            client = clientCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .send({
              client: client._id,
            })
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();
          expect(response.statusCode)
            .toBe(200);
        });

        test('Devuelve un id', () => {
          expect(response.body.id)
            .toBeTruthy();
        });
      });
    });
  });

  describe('GET /client/invoices/short', () => {
    const PATH = '/client/invoices/short';
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH)
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

      describe('El cliente no existe', () => {
        let response;

        before(done => {
          supertest(app)
            .get(PATH)
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

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new clientErrors.ClientIdNotFound().message);
        });
      });

      describe('El cliente existe', () => {
        let response;
        let client;

        before(() => ClientModel.create({ name: 'Cliente' })
          .then(clientCreated => {
            client = clientCreated;
          }));

        describe('Sin facturas', () => {
          before(done => {
            supertest(app)
              .get(`${PATH}?client=${client._id}`)
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(response.status)
              .toBe(200);
          });

          test('No devuelve facturas', () => {
            expect(response.body.count)
              .toBe(0);
            expect(response.body.invoices.length)
              .toBe(0);
          });
        });

        describe('Dispone de facturas', () => {
          before(() => ClientInvoiceModel.create({
            client: client._id,
            date: new Date().getTime(),
          }));
          before(() => ClientInvoiceModel.create({
            ...invoiceMock,
            client: client._id,
          }));

          before(done => {
            supertest(app)
              .get(`${PATH}?client=${client._id}&offset=1&limit=1`)
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(response.status)
              .toBe(200);
          });

          test('Devuelve las facturas', () => {
            expect(response.body.count)
              .toBe(2);
            expect(response.body.invoices[0].date)
              .toBe(invoiceMock.date);
            expect(response.body.invoices[0].total)
              .toBe(invoiceMock.total);
            expect(response.body.invoices[0].nInvoice)
              .toBe(invoiceMock.nInvoice);
          });
        });
      });
    });
  });

  describe('GET /client/invoices', () => {
    const PATH = '/client/invoices';
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH)
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

      let client;

      before(() => ClientModel.create({ name: 'Cliente' })
        .then(clientCreated => {
          client = clientCreated;
        }));

      describe('El año no es válido', () => {
        let response;
        before(done => {
          supertest(app)
            .get(`${PATH}?year=asd`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(response.status)
            .toBe(400);
        });

        test('No devuelve facturas', () => {
          expect(response.body.message)
            .toBe(new commonErrors.ParamNotValidError().message);
        });
      });

      describe('Sin facturas', () => {
        let response;
        before(done => {
          supertest(app)
            .get(`${PATH}?year=2020`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('No devuelve facturas', () => {
          expect(response.body.length)
            .toBe(0);
        });
      });

      describe('Dispone de facturas', () => {
        let response;
        before(() => ClientInvoiceModel.create({
          client: client._id,
          date: 1609355546762,
        }));

        before(() => ClientInvoiceModel.create({
          ...invoiceMock,
          client: client._id,
        }));

        before(done => {
          supertest(app)
            .get(`${PATH}?year=2020`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('Devuelve las facturas', () => {
          expect(response.body.length)
            .toBe(2);
          expect(response.body[1].date)
            .toBe(invoiceMock.date);
          expect(response.body[1].total)
            .toBe(invoiceMock.total);
          expect(response.body[1].nInvoice)
            .toBe(invoiceMock.nInvoice);
        });
      });
    });
  });
});
