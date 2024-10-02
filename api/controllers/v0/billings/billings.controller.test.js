const supertest = require('supertest');
const {
  mongoose,
  ProviderModel,
  BillingModel,
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
});
