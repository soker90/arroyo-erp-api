const supertest = require('supertest');
const { mongoose, ProductModel, ProviderModel } = require('arroyo-erp-models');
const testDB = require('../../../test/test-db')(mongoose);
const requestLogin = require('../../../test/request-login');
const app = require('../../..');

const productData = {
  code: '3333',
  name: 'Test product mod',
  provider: '5e41b4e1e6dabb35ee94f1d0',
  nameProvider: 'Nombre',
  amount: 32.3,
  iva: 11,
  re: 1.2,
  rate: 2,
};
describe('ProductController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('POST /products', () => {
    describe('Usuario no autenticado', () => {
      let response;

      before(done => {
        supertest(app)
          .post('/products')
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

      test('Existe el token', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('Falta iva', () => {
        let response;

        before(done => {
          const product = { ...productData };
          delete product.iva;
          supertest(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(product)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', () => {
          expect(response.statusCode)
            .toBe(422);
        });
      });

      describe('Se añade un producto correctamente', () => {
        let response;
        let provider;

        before(async () => {
          provider = await ProviderModel.create({
            name: 'Federico',
          });
        });

        beforeAll(done => {
          supertest(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
              ...productData,
              provider: provider._id,
            })
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

  describe('GET /products/:id', () => {
    describe('Usuario no autenticado', () => {
      let response;

      before(done => {
        supertest(app)
          .get('/products/5e41b4e1e6dabb35ee94f1d0')
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

      test('Existe el token', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('El id no existe', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/products/5e41b4e1e6dabb35ee94f1d0')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(response.statusCode)
            .toBe(404);
        });
      });

      describe('Devuelve el producto correctamente', () => {
        let response;
        let product;

        before(async () => {
          product = await ProductModel.create(productData);
        });

        beforeAll(done => {
          supertest(app)
            .get(`/products/${product._id}`)
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

        test('La información es correcta', () => {
          const json = JSON.parse(response.text).product;
          expect(JSON.stringify(json._id))
            .toEqual(JSON.stringify(product._id));
          expect(json.code)
            .toBe(product.code);
          expect(json.provider)
            .toBe(product.provider);
          expect(json.nameProvider)
            .toBe(product.nameProvider);
          expect(json.amount)
            .toBe(product.amount);
          expect(json.iva)
            .toBe(product.iva);
          expect(json.re)
            .toBe(product.re);
          expect(json.rate)
            .toBe(product.rate);
        });
      });
    });
  });

  describe('POST /products/:id/prices', () => {
    let product;
    before(async () => {
      product = await ProductModel.create(productData);
    });
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(`/products/${product._id}/prices`)
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

      test('Existe el token', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('Añade un precio correctamente', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(`/products/${product._id}/prices`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              price: 11.2,
              date: 1589752920000,
            })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 201', async () => {
          expect(response.statusCode)
            .toBe(201);
        });
      });

      describe('El producto no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/products/ss/prices')
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 11.2 })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', async () => {
          expect(response.statusCode)
            .toBe(422);
        });
      });

      describe('El precio no es numérico', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/products/ss/prices')
            .set('Authorization', `Bearer ${token}`)
            .send({ price: '88' })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', async () => {
          expect(response.statusCode)
            .toBe(422);
        });
      });

      describe('No se envía el precio', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/products/ss/prices')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', async () => {
          expect(response.statusCode)
            .toBe(422);
        });
      });
    });
  });
});
