const supertest = require('supertest');
const { mongoose, ProductModel, ProviderModel } = require('arroyo-erp-models');
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
};
describe('ProductController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /products', () => {
    const PATH = '/products';
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

        before(() => ProductModel.create(productMock)
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

          test('Debería dar un 400', () => {
            expect(response.statusCode)
              .toBe(400);
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
      });
    });
  });

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
          const product = { ...productMock };
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

        test('Debería dar un 400', () => {
          expect(response.statusCode)
            .toBe(400);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new providerErrors.ProviderIdNotFound().message);
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
              ...productMock,
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

  describe('PUT /products', () => {
    const PATH = id => `/products/${id}`;
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
          });
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
      product = await ProductModel.create(productMock);
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

        test('Debería dar un 400', () => {
          expect(response.statusCode)
            .toBe(400);
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

        test('Debería dar un 400', () => {
          expect(response.statusCode)
            .toBe(400);
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

        test('Debería dar un 400', () => {
          expect(response.statusCode)
            .toBe(400);
        });
      });
    });
  });
});
