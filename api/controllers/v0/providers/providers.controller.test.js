const supertest = require('supertest');
const { mongoose, ProviderModel, BillingModel } = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const { providerErrors, commonErrors } = require('../../../../errors');

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
};

describe('ProvidersController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /providers', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/providers')
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

      describe('Sin proveedores', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/providers')
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

      describe('Dispone de proveedores', () => {
        let provider;

        before(() => ProviderModel.create({
          _id: '5e430c9b7d2d2ded823b153b',
          name: 'La abuela',
          address: 'Calle pepito, 9',
          city: 'Las pedroñeras',
          postalCode: '16660',
          province: 'Cuenca',
          phone: '987456312',
          email: 'info@info.es',
          businessName: 'La abuela S.A.',
          cif: 'B23654578452',
          hasRate: true,
        })
          .then(providerCreated => {
            provider = providerCreated;
          }));

        describe('Devuelve los proveedores', () => {
          let response;

          before(done => {
            supertest(app)
              .get('/providers')
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
              .toEqual(JSON.stringify(provider._id));
            expect(json.name)
              .toBe(provider.name);
          });
        });

        describe('Devuelve los proveedores filtrados', () => {
          let response;

          const nameProviderTest = 'Un test de prueba';

          before(() => ProviderModel.create({
            name: nameProviderTest,
          }));

          before(done => {
            supertest(app)
              .get('/providers?name=prueb')
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

          test('Devuelve un array con el proveedor correcto', () => {
            expect(response.body.length)
              .toBe(1);
            expect(response.body[0].name)
              .toBe(nameProviderTest);
          });
        });
      });
    });
  });

  describe('POST /providers', () => {
    const PATH = '/providers';
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

      describe('No se envían parámetros', () => {
        let response;

        before(done => {
          supertest(app)
            .post(PATH)
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

        test('Devuelve un array', () => {
          expect(response.body.message)
            .toEqual(new providerErrors.ProviderMissingName().message);
        });
      });

      describe('Se crea un proveedor con un nombre', () => {
        let response;
        const name = 'Test';

        before(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({ name })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 201', () => {
          expect(response.status)
            .toBe(201);
        });
      });

      describe('Se mandan campos no válidos', () => {
        let response;
        const name = 'Test';

        before(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({
              name,
              invalid: 'invalid',
            })
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
            .toBe(new commonErrors.ParamNotValidError().message);
        });
      });

      describe('Se crea un proveedor completo', () => {
        let response;

        before(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send(providerMock)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 201', () => {
          expect(response.status)
            .toBe(201);
        });
      });
    });
  });

  describe('PUT /providers/:id', () => {
    const PATH = id => `/providers/${id}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .put(PATH('5f14857d3ae0d32b417e8d0c'))
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

      describe('No existe el proveedor', () => {
        let response;

        before(done => {
          supertest(app)
            .put(PATH('5f14857d3ae0d32b417e8d0c'))
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
            .toEqual(new providerErrors.ProviderIdNotFound().message);
        });
      });

      describe('Existe el proveedor', () => {
        let provider;

        before(() => ProviderModel.create({ name: 'Test' })
          .then(providerCreated => {
            provider = providerCreated;
          }));

        describe('No se envían parámetros', () => {
          let response;

          before(done => {
            supertest(app)
              .put(PATH(provider._id))
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

          test('Devuelve un array', () => {
            expect(response.body.message)
              .toEqual(new providerErrors.ProviderMissingName().message);
          });
        });

        describe('Se actualiza el proveedor', () => {
          let response;

          before(done => {
            supertest(app)
              .put(PATH(provider._id))
              .set('Authorization', `Bearer ${token}`)
              .send(providerMock)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 204', () => {
            expect(response.status)
              .toBe(204);
          });
        });
      });
    });
  });

  describe('GET /providers/:id', () => {
    const PATH = id => `/providers/${id}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH('5f14857d3ae0d32b417e8d0c'))
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

      describe('No existe el proveedor', () => {
        let response;

        before(done => {
          supertest(app)
            .get(PATH('5f14857d3ae0d32b417e8d0c'))
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
            .toEqual(new providerErrors.ProviderIdNotFound().message);
        });
      });

      describe('Existe el proveedor', () => {
        let provider;

        before(() => ProviderModel.create(providerMock)
          .then(providerCreated => {
            provider = providerCreated;
          }));

        describe('Se devuelven los datos', () => {
          let response;

          before(done => {
            supertest(app)
              .get(PATH(provider._id))
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

          test('Devuelve los datos correctos', () => {
            expect(response.body.billing.annual)
              .toEqual(0);
            expect(response.body.billing.trimesters.toString())
              .toEqual('0,0,0,0');
            expect(response.body.billing.year)
              .toEqual(new Date().getFullYear());

            expect(response.body.provider._id)
              .toEqual(provider._id.toString());
            expect(response.body.provider.address)
              .toEqual(provider.address);
            expect(response.body.provider.businessName)
              .toEqual(provider.businessName);
            expect(response.body.provider.cif)
              .toEqual(provider.cif);
            expect(response.body.provider.city)
              .toEqual(provider.city);
            expect(response.body.provider.email)
              .toEqual(provider.email);
            expect(response.body.provider.phone)
              .toEqual(provider.phone);
            expect(response.body.provider.postalCode)
              .toEqual(provider.postalCode);
            expect(response.body.provider.province)
              .toEqual(provider.province);
          });
        });

        describe('Se devuelven los datos y tiene facturación', () => {
          let response;
          const billing = {
            trimesters: [
              4,
              2.4,
              7.62,
              6.5,
            ],
            year: 2020,
          };

          before(() => BillingModel.create({
            ...billing,
            provider: provider._id,
          }));

          before(done => {
            supertest(app)
              .get(PATH(provider._id))
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

          test('Devuelve los datos correctos', () => {
            expect(response.body.billing.trimesters.toString())
              .toEqual(billing.trimesters.toString());
            expect(response.body.billing.year)
              .toEqual(billing.year);

            const annual = response.body.billing.trimesters.reduce(
              (prev, current) => prev + current,
            );

            expect(response.body.billing.annual)
              .toEqual(annual);

            expect(response.body.provider._id)
              .toEqual(provider._id.toString());
            expect(response.body.provider.address)
              .toEqual(provider.address);
            expect(response.body.provider.businessName)
              .toEqual(provider.businessName);
            expect(response.body.provider.cif)
              .toEqual(provider.cif);
            expect(response.body.provider.city)
              .toEqual(provider.city);
            expect(response.body.provider.email)
              .toEqual(provider.email);
            expect(response.body.provider.phone)
              .toEqual(provider.phone);
            expect(response.body.provider.postalCode)
              .toEqual(provider.postalCode);
            expect(response.body.provider.province)
              .toEqual(provider.province);
          });
        });
      });
    });
  });
});
