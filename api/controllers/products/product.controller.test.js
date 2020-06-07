const supertest = require('supertest');
const { mongoose, ProductModel } = require('arroyo-erp-models');
const testDB = require('../../../test/test-db')(mongoose);
const requestLogin = require('../../../test/request-login');
const app = require('../../..');


describe('ProductController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('POST /products/:id/price', () => {
    let product;
    before(async () => {
      product = await ProductModel.create({});
    });
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(`/products/${product._id}/price`)
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
        requestLogin().then(res => {
          token = res;
          done();
        });
      });

      test('Existe el token', () => {
        expect(token).toBeTruthy();
      });

      describe('Añade un  correctamente', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(`/products/${product._id}/price`)
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 11.2 })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 201', async () => {
          expect(response.statusCode).toBe(201);
        });
      });

      describe('El producto no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/products/ss/price')
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 11.2 })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', async () => {
          expect(response.statusCode).toBe(422);
        });
      });

      describe('El precio no es numérico', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/products/ss/price')
            .set('Authorization', `Bearer ${token}`)
            .send({ price: '88' })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', async () => {
          expect(response.statusCode).toBe(422);
        });
      });

      describe('No se envía el precio', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/products/ss/price')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', async () => {
          expect(response.statusCode).toBe(422);
        });
      });
    });
  });
});
