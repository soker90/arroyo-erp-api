const supertest = require('supertest');
const {
  mongoose,
  PriceChangeModel,
} = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');

const {
  priceChangeErrors,
} = require('../../../../errors');

describe('PriceChangeController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  const priceChangeMock = {
    deliveryOrder: '6002ec8886fa9521f4d6976c',
    product: '5f7e13c315e88854b95b3cb0',
    date: 1610665200000.0,
    diff: 1.54,
    price: 2.54,
    productName: 'test',
  };

  describe('GET /pricechanges', () => {
    const PATH = '/pricechanges';
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

      describe('Sin registros', () => {
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
          expect(response.body.count)
            .toEqual(0);
          expect(response.body.priceChanges)
            .toEqual([]);
        });
      });

      describe('Tiene registros', () => {
        let response;
        let priceChange;

        before(() => PriceChangeModel.create(priceChangeMock)
          .then(priceCreated => {
            priceChange = priceCreated;
          }));

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
          expect(response.body.count)
            .toBe(1);
        });

        test('Los datos son correctos', () => {
          const json = response.body.priceChanges[0];
          expect(json._id)
            .toEqual(priceChange._id.toString());
          expect(json.deliveryOrder)
            .toBe(priceChange.deliveryOrder);
          expect(json.product)
            .toBe(priceChange.product);
          expect(json.date)
            .toBe(priceChange.date);
          expect(json.price)
            .toBe(priceChange.price);
          expect(json.diff)
            .toBe(priceChange.diff);
          expect(json.price)
            .toBe(priceChange.price);
          expect(json.productName)
            .toBe(priceChange.productName);
        });
      });
    });
  });

  describe('PATCH /pricechanges/:id', () => {
    const PATH = id => `/pricechanges/${id}`;

    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch(PATH('5f567000685de0559bf930f8'))
          .send({ read: true })
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

      describe('No existe la notificación', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch(PATH('5f567000685de0559bf930f8'))
            .set('Authorization', `Bearer ${token}`)
            .send({ read: true })
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
            .toBe(new priceChangeErrors.PriceChangeNotFound().message);
        });
      });

      describe('Se procesa correctamente', () => {
        let response;
        let priceChange;

        beforeAll(() => PriceChangeModel.create(priceChangeMock)
          .then(priceChangeCreated => {
            priceChange = priceChangeCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(priceChange._id))
            .set('Authorization', `Bearer ${token}`)
            .send({
              read: true,
            })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('Devuelve la nota como leida', () => {
          expect(response.body.priceChanges[0].read)
            .toBe(true);
        });
      });
    });
  });

  describe('DELETE /pricechanges/:id', () => {
    const PATH = id => `/pricechanges/${id}`;

    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .delete(PATH('5f567000685de0559bf930f8'))
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

      describe('No existe la notificación', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .delete(PATH('5f567000685de0559bf930f8'))
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
            .toBe(new priceChangeErrors.PriceChangeNotFound().message);
        });
      });

      describe('Se elimina la nota correctamente', () => {
        let response;
        let priceChange;

        beforeAll(() => PriceChangeModel.create(priceChangeMock)
          .then(priceChangeCreated => {
            priceChange = priceChangeCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .delete(PATH(priceChange._id))
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

        test('La notificación se ha borrado', () => {
          expect(response.body.count)
            .toBe(0);
          expect(response.body.priceChanges.length)
            .toBe(0);
        });
      });
    });
  });

  describe('GET /pricechanges/unread/count', () => {
    const PATH = '/pricechanges/unread/count';
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

      describe('Sin notificaciones sin leer', () => {
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
          expect(response.body.count)
            .toEqual(0);
        });
      });

      describe('Tiene registros', () => {
        let response;

        before(() => PriceChangeModel.create(priceChangeMock));

        before(() => PriceChangeModel.create({ ...priceChangeMock, read: true }));

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
          expect(response.body.count)
            .toBe(1);
        });
      });
    });
  });

  describe('POST /pricechanges/deletemany', () => {
    before(() => testDB.cleanAll());
    const PATH = '/pricechanges/deletemany';
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

      let priceChange;

      beforeAll(() => PriceChangeModel.create(priceChangeMock)
        .then(priceChangeCreated => {
          priceChange = priceChangeCreated;
        }));

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('Los ids no son válidos', () => {
        let response;

        before(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({ ids: ['5f567000685de0559bf930f8', priceChange._id] })
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
            .toEqual(new priceChangeErrors.ElementsNotFound().message);
        });
      });

      describe('Se envían los cambios de precio', () => {
        let response;
        let priceChange2;

        before(() => PriceChangeModel.create(priceChangeMock)
          .then(priceCreated => {
            priceChange2 = priceCreated;
          }));

        before(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({ ids: [priceChange2._id] })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('Se eliminan las notificaciones seleccionadas', () => {
          const pc = response.body.priceChanges[0];
          expect(response.body.count)
            .toBe(1);
          expect(pc._id)
            .toBe(priceChange._id.toString());
          expect(pc.date)
            .toBe(priceChange.date);
          expect(pc.deliveryOrder)
            .toBe(priceChange.deliveryOrder);
          expect(pc.diff)
            .toBe(priceChange.diff);
          expect(pc.price)
            .toBe(priceChange.price);
          expect(pc.product)
            .toBe(priceChange.product);
          expect(pc.productName)
            .toBe(priceChange.productName);
        });
      });
    });
  });
});
