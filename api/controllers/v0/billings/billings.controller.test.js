const supertest = require('supertest');
const {
  mongoose,
  ProviderModel,
  BillingModel,
  InvoiceModel,
} = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const {
  billingErrors,
} = require('../../../../errors');

const providerMock = {
  name: 'Auuu',
  city: 'Alcaza',
  postalCode: '78349',
  province: 'AB',
  address: 'C/falsa, 999',
  phone: '666667773',
  email: 'eem@mail.com',
  businessName: 'Auu JS',
  cif: '444U',
  type: 'General',
};

const billingMock = {
  year: 2020,
  annual: 3005.63,
  trimesters: [
    5,
    0,
    2000.63,
    1000,
  ],
  invoicesTrimester3: [
    {},
    {},
  ],
  invoicesTrimester0: [
    {},
  ],
};

describe('BillingsController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /billings', () => {
    const singlePath = '/billings';
    const PATH = year => `/billings?year=${year}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(singlePath)
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

      describe('No se envía el año', () => {
        let response;

        before(done => {
          supertest(app)
            .get(singlePath)
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

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new billingErrors.BillingYearMissing().message);
        });
      });

      describe('No hay facturación', () => {
        let response;

        before(done => {
          supertest(app)
            .get(PATH(2020))
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

        test('Devuelve un array vacío', () => {
          expect(response.body.length)
            .toBe(0);
        });
      });

      describe('Dispone de facturación', () => {
        let provider;
        let billing;
        let response;

        before(() => ProviderModel.create(providerMock)
          .then(providerCreated => {
            provider = providerCreated;
          }));

        before(() => BillingModel.create({
          ...billingMock,
          provider: provider._id,
        })
          .then(billingCreated => {
            billing = billingCreated;
          }));

        before(done => {
          supertest(app)
            .get(PATH(2020))
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

        test('Los datos son correctos', () => {
          const responseData = response.body[0];

          const invoices1 = billingMock.invoicesTrimester0?.length ?? 0;
          const invoices2 = billingMock.invoicesTrimester1?.length ?? 0;
          const invoices3 = billingMock.invoicesTrimester2?.length ?? 0;
          const invoices4 = billingMock.invoicesTrimester3?.length ?? 0;

          expect(responseData.annual)
            .toBe(billing.annual);
          expect(responseData.businessName)
            .toBe(provider.businessName);
          expect(responseData.name)
            .toBe(provider.name);
          expect(responseData.trimester1)
            .toBe(billing.trimesters[0]);
          expect(responseData.invoices1)
            .toBe(invoices1);
          expect(responseData.trimester2)
            .toBe(billing.trimesters[1]);
          expect(responseData.invoices2)
            .toBe(invoices2);
          expect(responseData.trimester3)
            .toBe(billing.trimesters[2]);
          expect(responseData.invoices3)
            .toBe(invoices3);
          expect(responseData.trimester4)
            .toBe(billing.trimesters[3]);
          expect(responseData.invoices4)
            .toBe(invoices4);
          expect(responseData.annualInvoices)
            .toBe(invoices1 + invoices2 + invoices3 + invoices4);
        });
      });
    });
  });

  describe('GET /billings/export?year=:year', () => {
    const singlePath = '/billings/export';
    const PATH = year => `/billings/export?year=${year}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH(2000))
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

      beforeAll(done => {
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

      describe('El año no es válido', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .get(singlePath)
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

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new billingErrors.BillingYearMissing().message);
        });
      });

      describe('La petición se procesa correctamente', () => {
        let response;
        let provider;

        before(() => ProviderModel.create(providerMock)
          .then(providerCreated => {
            provider = providerCreated;
          }));

        before(() => BillingModel.create({
          ...billingMock,
          provider: provider._id,
        }));

        beforeAll(done => {
          supertest(app)
            .get(PATH(2020))
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
      });

      describe('La petición se procesa correctamente con los mayores a  3005€', () => {
        let response;
        let provider;

        before(() => ProviderModel.create(providerMock)
          .then(providerCreated => {
            provider = providerCreated;
          }));

        before(() => BillingModel.create({
          ...billingMock,
          provider: provider._id,
        }));

        beforeAll(done => {
          supertest(app)
            .get(PATH('2020&short=true'))
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
      });
    });
  });

  describe('POST /billings/recalc?year=:year', () => {
    const singlePath = '/billings/recalc';
    const PATH = year => `/billings/recalc?year=${year}`;

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(PATH(2021))
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

      beforeAll(done => {
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

      describe('El año no es válido', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(singlePath)
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

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new billingErrors.BillingYearMissing().message);
        });
      });

      describe('La petición se procesa correctamente y recalcula los totales', () => {
        let response;
        let provider;
        let invoice1;
        let invoice2;

        before(() => ProviderModel.create(providerMock)
          .then(providerCreated => {
            provider = providerCreated;
          }));

        before(() => InvoiceModel.create({
          provider: provider._id,
          dateInvoice: new Date('2021-02-15').getTime(),
          total: 1500,
          nOrder: 1,
        })
          .then(inv => {
            invoice1 = inv;
          }));

        before(() => InvoiceModel.create({
          provider: provider._id,
          dateInvoice: new Date('2021-08-20').getTime(),
          total: 2500.50,
          nOrder: 2,
        })
          .then(inv => {
            invoice2 = inv;
          }));

        before(() => BillingModel.create({
          year: 2021,
          provider: provider._id,
          invoicesTrimester0: [
            {
              invoice: invoice1._id.toString(),
              total: 1000, // Total incorrecto
              date: new Date('2021-02-15').getTime(),
            },
          ],
          invoicesTrimester2: [
            {
              invoice: invoice2._id.toString(),
              total: 2000, // Total incorrecto
              date: new Date('2021-08-20').getTime(),
            },
          ],
          trimesters: [1000, 0, 2000, 0],
          annual: 3000,
        }));

        beforeAll(done => {
          supertest(app)
            .post(PATH(2021))
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

        test('Debería devolver el número de billings actualizados', () => {
          expect(response.body.updated)
            .toBe(1);
        });

        test('Debería devolver los detalles de los cambios', () => {
          expect(response.body.changes).toBeDefined();
          expect(Array.isArray(response.body.changes)).toBe(true);
          expect(response.body.changes.length).toBe(1);

          const change = response.body.changes[0];
          expect(change.providerId).toBeDefined();
          expect(change.providerName).toBeDefined();
          expect(change.invoices).toBeDefined();
          expect(Array.isArray(change.invoices)).toBe(true);
          expect(change.invoices.length).toBe(2); // 2 facturas modificadas
          expect(change.trimesters).toBeDefined();
          expect(Array.isArray(change.trimesters)).toBe(true);
          expect(change.sumErrors).toBeDefined();
          expect(Array.isArray(change.sumErrors)).toBe(true);
        });

        test('Los totales deberían estar actualizados en la base de datos', done => {
          BillingModel.findOne({ year: 2021, provider: provider._id })
            .then(billing => {
              expect(billing.invoicesTrimester0[0].total).toBe(1500);
              expect(billing.invoicesTrimester2[0].total).toBe(2500.50);
              expect(billing.trimesters[0]).toBe(1500);
              expect(billing.trimesters[2]).toBe(2500.50);
              expect(billing.annual).toBe(4000.50);
              done();
            });
        });
      });
    });
  });
});
