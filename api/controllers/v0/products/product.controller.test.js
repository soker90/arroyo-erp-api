const supertest = require('supertest');
const {
  mongoose, ProductModel, ProviderModel, PriceModel,
} = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const { providerErrors, productErrors } = require('../../../../errors');

const productMock = {
  code: '3333',
  name: 'Test product mod',
  provider: '5e41b4e1e6dabb35ee94f1d0',
  nameProvider: 'Nombre',
  amount: 32.3,
  iva: 11,
  re: 1.2,
  rate: 2,
  price: 4,
  cost: 4.23,
  sale: 1.13,
};

const product2Mock = {
  code: '4444',
  name: 'Otro prdoucto',
  provider: '5f1ac206dbcc4879c9c14c54',
  nameProvider: 'Proveedor',
  amount: 5.4,
  iva: 3.445,
  re: 3.21,
  rate: 5,
  price: 3,
  cost: 3.33,
  sale: 3.73,
  profit: 12.3,
};

const productClient = {
  name: 'Product 9',
  price: 22.5,
};

describe('ProductController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /products', () => {
    const PATH = '/products';
    afterAll(() => testDB.cleanAll());
    describe('Usuario no autenticado', () => {
      let response;

      before(done => {
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

      test('Existe el token', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('No existen productos', () => {
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
          expect(response.statusCode)
            .toBe(200);
        });

        test('Devuelve un array sin elementos', () => {
          expect(response.body.length)
            .toBe(0);
        });
      });

      describe('Hay productos', () => {
        let response;
        let product;

        before(() => ProductModel.create({ productMock, provider: undefined })
          .then(productCreated => {
            product = productCreated;
          }));

        describe('Se obtienen los productos', () => {
          beforeAll(done => {
            supertest(app)
              .get(PATH)
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
            expect(response.body.length)
              .toBe(1);
            const productResponse = response.body[0];
            expect(productResponse._id)
              .toEqual(product._id.toString());
            expect(productResponse.code)
              .toBe(product.code);
            expect(productResponse.name)
              .toBe(product.name);
          });
        });

        describe('No existe el proveedor', () => {
          let product2;

          before(() => ProductModel.create(product2Mock)
            .then(productCreated => {
              product2 = productCreated;
            }));

          beforeAll(done => {
            supertest(app)
              .get(`${PATH}?provider=${product2.provider}`)
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

          test('El mensaje de error es correcto', () => {
            expect(response.body.message)
              .toBe(new providerErrors.ProviderIdNotFound().message);
          });
        });

        describe('Se filtran los productos por proveedor', () => {
          let product2;
          let provider;

          before(() => ProviderModel.create({
            name: 'Test',
          })
            .then(create => {
              provider = create;
            }));

          before(() => ProductModel.create({
            ...product2Mock,
            provider: provider._id,
            nameProvider: provider.name,
          })
            .then(productCreated => {
              product2 = productCreated;
            }));

          beforeAll(done => {
            supertest(app)
              .get(`${PATH}?provider=${product2.provider}`)
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
            expect(response.body.length)
              .toBe(1);
            const productResponse = response.body[0];
            expect(productResponse._id)
              .toEqual(product2._id.toString());
            expect(productResponse.code)
              .toBe(product2.code);
            expect(productResponse.name)
              .toBe(product2.name);
          });
        });

        describe('Se obtienen los productos con el precio', () => {
          beforeAll(done => {
            supertest(app)
              .get(PATH)
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
            const productResponse = response.body[0];
            expect(productResponse._id)
              .toEqual(product._id.toString());
            expect(productResponse.code)
              .toBe(product.code);
            expect(productResponse.name)
              .toBe(product.name);
            expect(productResponse.cost)
              .toBe(product.cost);
            expect(productResponse.price)
              .toBe(product.price);
            expect(productResponse.sale)
              .toBe(product.sale);
          });
        });
      });
    });
  });

  describe('POST /products', () => {
    afterAll(() => testDB.cleanAll());
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

      describe('No existe el proveedor', () => {
        let response;

        before(done => {
          const product = { ...productMock };
          delete product.nameProvider;
          supertest(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(product)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new providerErrors.ProviderIdNotFound().message);
        });
      });

      describe('Existe el proveedor', () => {
        let provider;

        before(async () => {
          provider = await ProviderModel.create({
            name: 'Federico',
          });
        });

        describe('No se envía iva', () => {
          let response;

          before(done => {
            const product = { ...productMock };
            delete product.nameProvider;
            delete product.iva;
            supertest(app)
              .post('/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                ...product,
                provider: provider._id,
              })
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 400', () => {
            expect(response.statusCode)
              .toBe(400);
          });

          test('El mensaje de error es correcto', () => {
            expect(response.body.message)
              .toBe(new productErrors.ProductMissingParams().message);
          });
        });

        describe('No se envía profit', () => {
          let response;

          before(done => {
            const product = { ...productMock };
            delete product.nameProvider;
            delete product.profit;
            supertest(app)
              .post('/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                ...product,
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

        describe('No se envía nombre', () => {
          let response;

          before(done => {
            const product = { ...productMock };
            delete product.nameProvider;
            delete product.re;
            supertest(app)
              .post('/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                ...product,
                provider: provider._id,
              })
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 400', () => {
            expect(response.statusCode)
              .toBe(400);
          });

          test('El mensaje de error es correcto', () => {
            expect(response.body.message)
              .toBe(new productErrors.ProductMissingParams().message);
          });
        });

        describe('No se envía recargo', () => {
          let response;

          before(done => {
            const product = { ...productMock };
            delete product.nameProvider;
            delete product.name;
            supertest(app)
              .post('/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                ...product,
                provider: provider._id,
              })
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 400', () => {
            expect(response.statusCode)
              .toBe(400);
          });

          test('El mensaje de error es correcto', () => {
            expect(response.body.message)
              .toBe(new productErrors.ProductMissingParams().message);
          });
        });

        describe('Se añade un producto correctamente', () => {
          let response;

          beforeAll(done => {
            supertest(app)
              .post('/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                ...product2Mock,
                provider: provider._id,
              })
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

        describe('El código de producto está duplicado', () => {
          let response;

          beforeAll(done => {
            supertest(app)
              .post('/products')
              .set('Authorization', `Bearer ${token}`)
              .send({
                ...productMock,
                provider: provider._id,
              })
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 409', () => {
            expect(response.status)
              .toBe(409);
          });

          test('El mensaje de error es correcto', () => {
            expect(response.body.message)
              .toBe(new productErrors.ProductCodeExists().message);
          });
        });
      });
    });
  });

  describe('PUT /products', () => {
    const PATH = id => `/products/${id}`;
    afterAll(() => testDB.cleanAll());
    describe('Usuario no autenticado', () => {
      let response;

      before(done => {
        supertest(app)
          .put(PATH('5f1ac206dbcc4879c9c14c54'))
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

      describe('No existe el producto', () => {
        let response;

        before(done => {
          supertest(app)
            .put(PATH('5f1ac206dbcc4879c9c14c54'))
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

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new productErrors.ProductNotFound().message);
        });
      });

      describe('Existe el producto', () => {
        let product;

        before(() => ProductModel.create(productMock)
          .then(productCreated => {
            product = productCreated;
          }));
        describe('Se modifica el producto correctamente', () => {
          let response;

          beforeAll(done => {
            supertest(app)
              .put(PATH(product._id))
              .set('Authorization', `Bearer ${token}`)
              .send({
                code: product2Mock.code,
                name: product2Mock.name,
                iva: product2Mock.iva,
                re: product2Mock.re,
                rate: product2Mock.rate,
              })
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(response.statusCode)
              .toBe(200);
          });

          test('La respuesta es correcta', () => {
            expect(response.body._id)
              .toBe(product._id.toString());
            expect(response.body.code)
              .toBe(product2Mock.code);
            expect(response.body.iva)
              .toBe(product2Mock.iva);
            expect(response.body.name)
              .toBe(product2Mock.name);
            expect(response.body.nameProvider)
              .toBe(product.nameProvider);
            expect(response.body.provider)
              .toBe(product.provider);
            expect(response.body.rate)
              .toBe(product2Mock.rate);
            expect(response.body.re)
              .toBe(product2Mock.re);
            expect(response.body.profit)
              .toBeFalsy();
          });
        });

        describe('El código está duplicado', () => {
          let response;
          let product2;

          before(() => ProductModel.create(productMock)
            .then(productCreated => {
              product2 = productCreated;
            }));

          beforeAll(done => {
            supertest(app)
              .put(PATH(product2._id))
              .set('Authorization', `Bearer ${token}`)
              .send(product2Mock)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 409', () => {
            expect(response.statusCode)
              .toBe(409);
          });

          test('El mensaje de error es correcto', () => {
            expect(response.body.message)
              .toBe(new productErrors.ProductCodeExists().message);
          });
        });
      });
    });
  });

  describe('GET /products/:id', () => {
    afterAll(() => testDB.cleanAll());
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

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new productErrors.ProductNotFound().message);
        });
      });

      describe('Devuelve el producto correctamente', () => {
        let response;
        let product;

        before(async () => {
          product = await ProductModel.create(productMock);
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
          const json = response.body.product;
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
          expect(json.profit)
            .toBe(product.profit);
          expect(response.body.prices)
            .toEqual([]);
        });
      });

      describe('Devuelve un producto con precios', () => {
        let response;
        let product;
        const price1 = {
          date: Date.now(),
          price: 3,
          cost: 4,
          sale: 4.5,
        };

        const price2 = {
          date: Date.now(),
          price: 4.1,
          cost: 4.6,
          sale: 5.1,
        };

        before(async () => {
          product = await ProductModel.create(productMock);
          await PriceModel.create({
            ...price1,
            product: product._id,
          });

          await PriceModel.create({
            ...price2,
            product: product._id,
          });
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
          expect(response.body.prices)
            .toBeInstanceOf(Array);

          const reviewPrice = (price, mock) => {
            expect(price.date)
              .toBe(mock.date);
            expect(price.price)
              .toBe(mock.price);
            expect(price.cost)
              .toBe(mock.cost);
            expect(price.sale)
              .toBe(mock.sale);
          };

          reviewPrice(response.body.prices[0], price1);
          reviewPrice(response.body.prices[1], price2);
        });
      });
    });
  });
  describe('POST /products/clients', () => {
    const PATH = '/products/clients';
    afterAll(() => testDB.cleanAll());
    describe('Usuario no autenticado', () => {
      let response;

      before(done => {
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

      test('Existe el token', () => {
        expect(token)
          .toBeTruthy();
      });

      describe.each([
        'name', 'price',
      ])('No se envía %s', (item => {
        let response;

        beforeAll(done => {
          const productData = { ...productClient };
          delete productData[item];
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send(productData)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(400);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new productErrors.ProductMissingParams().message);
        });
      }));

      describe('Se añade un producto correctamente', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send(productClient)
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
          expect(response.body[0].name).toBe(productClient.name);
          expect(response.body[0].price).toBe(productClient.price);
        });
      });

    });
  });
});
