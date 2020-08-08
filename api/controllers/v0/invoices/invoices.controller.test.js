const supertest = require('supertest');
const { mongoose, InvoiceModel } = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const { commonErrors } = require('../../../../errors');

const invoiceMock = {
  total: 295.74,
  dateInvoice: 1594474393373,
  dateRegister: 1594474393373,
  nInvoice: '22/2020',
  nOrder: 2,
};

describe('InvoicesController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /invoices', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/invoices')
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

      describe('No se envía año', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/invoices')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(response.statusCode)
            .toBe(400);
        });

        test('Devuelve el mensaje correcto', () => {
          expect(response.body.message)
            .toBe(new commonErrors.ParamNotValidError().message);
        });
      });

      describe('Sin facturas', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/invoices?year=2020')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.statusCode)
            .toBe(200);
        });

        test('Devuelve un array', () => {
          expect(response.body)
            .toEqual([]);
        });
      });

      describe('Dispone de facturas', () => {
        let invoice;

        before(() => InvoiceModel.create(invoiceMock)
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        describe('No se pasa offset ni limit', () => {
          let response;

          before(done => {
            supertest(app)
              .get('/invoices?year=2020')
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

          test('Devuelve un array con un elemento', () => {
            expect(response.body.length)
              .toBe(1);
          });

          test('Los datos son correctos', () => {
            const json = JSON.parse(response.text)[0];
            expect(JSON.stringify(json._id))
              .toEqual(JSON.stringify(invoice._id));
            expect(json.nOrder)
              .toBe(invoice.nOrder);
            expect(json.total)
              .toBe(invoice.total);
            expect(json.dateInvoice)
              .toBe(invoice.dateInvoice);
          });
        });
      });
    });
  });

  describe('GET /invoices/short', () => {
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/invoices/short')
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

      describe('Sin facturas', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/invoices/short')
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

        test('Devuelve un array', () => {
          expect(JSON.parse(response.text))
            .toEqual([]);
        });
      });

      describe('Dispone de facturas', () => {
        let invoice;

        before(() => InvoiceModel.create({
          total: 295.74,
          dateInvoice: 1594474393373.0,
          nInoice: '22/2020',
          nOrder: 2,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        describe('No se pasan parámetros', () => {
          let response;

          before(done => {
            supertest(app)
              .get('/invoices/short')
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

          test('Devuelve un array con un elemento', () => {
            expect(JSON.parse(response.text).length)
              .toBe(1);
          });

          test('Los datos son correctos', () => {
            const json = JSON.parse(response.text)[0];
            expect(JSON.stringify(json._id))
              .toEqual(JSON.stringify(invoice._id));
            expect(json.nOrder)
              .toBe(invoice.nOrder);
            expect(json.total)
              .toBe(invoice.total);
            expect(json.dateInvoice)
              .toBe(invoice.dateInvoice);
          });
        });
      });
    });
  });

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

  describe('PATCH /invoices/:id', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch('/invoices/5ef26172ccfd9d1541b870be')
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

      describe('No contiene datos de la factura ni totales', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({})
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', async () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(400);
        });
      });

      describe('Actualiza los campos', () => {
        let response;
        let invoice;
        const invoiceData = {
          dateInvoice: 1594062299563,
          dateRegister: 1594062299563,
          nInvoice: '333/2203',
        };

        const invoiceTotals = {
          total: 12,
          iva: 10,
          re: 8,
          rate: 2.2,
          taxBase: 3.6,
        };

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        const testData = () => {
          const { data } = JSON.parse(response.text);
          expect(data.dateInvoice)
            .toBe(invoiceData.dateInvoice);
          expect(data.dateRegister)
            .toBe(invoiceData.dateRegister);
          expect(data.nInvoice)
            .toBe(invoiceData.nInvoice);
        };

        const testTotals = () => {
          const { totals } = JSON.parse(response.text);
          expect(totals.total)
            .toBe(invoiceTotals.total);
          expect(totals.iva)
            .toBe(invoiceTotals.iva);
          expect(invoiceTotals.re)
            .toBe(invoiceTotals.re);
          expect(invoiceTotals.rate)
            .toBe(invoiceTotals.rate);
          expect(invoiceTotals.taxBase)
            .toBe(invoiceTotals.taxBase);
        };

        describe('Se actualiza data y totals', () => {
          beforeAll(done => {
            supertest(app)
              .patch(`/invoices/${invoice._id}`)
              .send({
                data: invoiceData,
                totals: invoiceTotals,
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

          test('Se ha actualizado data', () => {
            testData();
          });

          test('Se ha actualizado los totales', () => {
            testTotals();
          });
        });

        describe('Se actualiza data', () => {
          beforeAll(done => {
            supertest(app)
              .patch(`/invoices/${invoice._id}`)
              .send({
                data: invoiceData,
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

          test('Se han actualizado data', () => {
            testData();
          });
        });

        describe('Se actualiza los totales', () => {
          beforeAll(done => {
            supertest(app)
              .patch(`/invoices/${invoice._id}`)
              .send({
                totals: invoiceTotals,
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

          test('Se ha actualizado los totales', () => {
            testTotals();
          });
        });
      });
    });
  });

  describe('PATCH /invoices/:id/confirm', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch('/invoices/5ef26172ccfd9d1541b870be/confirm')
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
            .patch('/invoices/5ef26172ccfd9d1541b870be/confirm')
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

      describe('No tiene fecha de factura', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({})
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({ type: 'Efectivo' })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', async () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(422);
        });
      });

      describe('No tiene tipo de pago', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', async () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(400);
        });
      });

      describe('Asigna el número de orden', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({ type: 'Efectivo' })
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

        test('Se ha asignado un número de order', () => {
          expect(JSON.parse(response.text).nOrder)
            .toBe(1);
        });
      });
    });
  });
});
