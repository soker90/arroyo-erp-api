const supertest = require('supertest');
const { mongoose, ClientModel } = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const { clientErrors, commonErrors } = require('../../../../errors');

const clientMock = {
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

const client2Mock = {
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

describe('ClientController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /clients', () => {
    const PATH = '/clients';
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

      describe('Sin clientes', () => {
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

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('Devuelve un array', () => {
          expect(JSON.parse(response.text))
            .toEqual([]);
        });
      });

      describe('Dispone de clientes', () => {
        let client;

        before(() => ClientModel.create(clientMock)
          .then(providerCreated => {
            client = providerCreated;
          }));

        describe('Devuelve los clientes', () => {
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

          test('Debería dar un 200', () => {
            expect(response.status)
              .toBe(200);
          });

          test('Devuelve un array con un elemento', () => {
            expect(JSON.parse(response.text).length)
              .toBe(1);
          });

          test('Los datos son correctos', () => {
            const json = response.body[0];
            expect(JSON.stringify(json._id))
              .toEqual(JSON.stringify(client._id));
            expect(json.name)
              .toBe(client.name);
          });
        });
      });
    });
  });

  describe('POST /clients', () => {
    const PATH = '/clients';
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

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toEqual(new clientErrors.ClientMissingName().message);
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
          expect(response.statusCode)
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

      describe('Se crea un cliente completo', () => {
        let response;

        before(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send(clientMock)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 201', () => {
          expect(response.statusCode)
            .toBe(201);
        });
      });
    });
  });

  describe('PUT /clients/:id', () => {
    const PATH = id => `/clients/${id}`;
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

      describe('No existe el cliente', () => {
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
            .toEqual(new clientErrors.ClientIdNotFound().message);
        });
      });

      describe('Existe el cliente', () => {
        let client;

        before(() => ClientModel.create({ name: 'Test' })
          .then(clientCreated => {
            client = clientCreated;
          }));

        describe('No se envían parámetros', () => {
          let response;

          before(done => {
            supertest(app)
              .put(PATH(client._id))
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
              .toEqual(new clientErrors.ClientMissingName().message);
          });
        });

        describe('Se actualiza el proveedor', () => {
          let response;

          before(done => {
            supertest(app)
              .put(PATH(client._id))
              .set('Authorization', `Bearer ${token}`)
              .send(clientMock)
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

  describe('GET /clients/:id', () => {
    const PATH = id => `/clients/${id}`;
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

      describe('No existe el cliente', () => {
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
            .toEqual(new clientErrors.ClientIdNotFound().message);
        });
      });

      describe('Existe el proveedor', () => {
        let client;

        before(() => ClientModel.create(clientMock)
          .then(clientCreated => {
            client = clientCreated;
          }));

        describe('Se devuelven los datos', () => {
          let response;

          before(done => {
            supertest(app)
              .get(PATH(client._id))
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
            expect(response.body._id)
              .toEqual(client._id.toString());
            expect(response.body.address)
              .toEqual(client.address);
            expect(response.body.businessName)
              .toEqual(client.businessName);
            expect(response.body.cif)
              .toEqual(client.cif);
            expect(response.body.city)
              .toEqual(client.city);
            expect(response.body.email)
              .toEqual(client.email);
            expect(response.body.phone)
              .toEqual(client.phone);
            expect(response.body.postalCode)
              .toEqual(client.postalCode);
            expect(response.body.province)
              .toEqual(client.province);
          });
        });
      });
    });
  });
});
