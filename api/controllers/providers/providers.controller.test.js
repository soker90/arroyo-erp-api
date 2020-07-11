const supertest = require('supertest');
const { mongoose, ProviderModel } = require('arroyo-erp-models');
const testDB = require('../../../test/test-db')(mongoose);
const requestLogin = require('../../../test/request-login');
const app = require('../../..');

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
      });
    });
  });
});
