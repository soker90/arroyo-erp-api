const supertest = require('supertest');
const {
        mongoose,
        DeliveryOrderModel,
        ProviderModel,
        ProductModel,
        PriceModel,
        InvoiceModel,
        ClientModel,
      } = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const {
        deliveryOrderErrors,
        productErrors,
        clientErrors,
      } = require('../../../../errors');
const { roundNumber } = require('../../../../utils');

const deliveryOrderMock = {
  provider: '5f14857d3ae0d32b417e8d0c',
  nameProvider: 'Primero',
  date: 1596632580000.0,
  total: 75.48,
  iva: 6.8,
  rate: 0.5,
  re: 0.68,
  taxBase: 68,
  hasCanal: true,
  products: [
    {
      code: '',
      product: '5f188ec1deae8d5c1b549336',
      price: 8,
      quantity: 8,
      name: 'yiuyi',
      taxBase: 68,
      rate: 0.5,
      iva: 6.8,
      re: 0.68,
      total: 75.48,
      canal: '33s',

    },
  ],
};

const deliveryOrder2Mock = {
  provider: '5f14857d3ae0d32b417e8d0c',
  nameProvider: 'Primero',
  date: 1597323720000.0,
  size: 0,
  total: 69.544,
  iva: 2.624,
  rate: 0.201,
  re: 1.312,
  taxBase: 65.608,
  products: [
    {
      code: '12',
      product: '5f148a51702f6d366d76d9c4',
      price: 8,
      quantity: 8,
      name: 'prueba',
      taxBase: 65.608,
      rate: 0.201,
      diff: 7,
      iva: 2.624,
      re: 1.312,
      total: 69.544,
    },
  ],
  invoice: '5f2ea2b4536f7e67a53d07f7',
  nOrder: 47,
};

const productMock = {
  code: '12',
  name: 'prueba',
  rate: 0.804,
  iva: 0.04,
  re: 0.02,
  provider: '5f14857d3ae0d32b417e8d0c',
  nameProvider: 'Primero',
};

const productNoRateMock = {
  code: '12',
  name: 'prueba',
  iva: 0.04,
  re: 0.02,
  provider: '5f14857d3ae0d32b417e8d0c',
  nameProvider: 'Primero',
};

describe('DeliveryOrderController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /deliveryorders', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/deliveryorders')
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

      describe('No hay albaranes', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/deliveryorders')
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

        test('Devuelve dos arrays vacios', () => {
          expect(response.body.free.length)
            .toBe(0);
          expect(response.body.inInvoices.count)
            .toBe(0);
          expect(response.body.inInvoices.data.length)
            .toBe(0);
        });
      });

      describe('Dispone de albaranes', () => {
        let deliveryOrder;
        let deliveryOrder2;
        let provider;

        before(async () => {
          provider = await ProviderModel.create({ name: 'Primero' });
          deliveryOrder = await DeliveryOrderModel.create({
            ...deliveryOrderMock,
            provider: provider._id,
          });
          deliveryOrder2 = await DeliveryOrderModel.create({
            ...deliveryOrder2Mock,
            provider: provider._id,
          });
        });

        describe('No se pasa offset ni limit', () => {
          let response;

          before(done => {
            supertest(app)
              .get(`/deliveryorders?provider=${deliveryOrder.provider}`)
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

          test('Devuelve un albarán sin factura', () => {
            expect(response.body.free.length)
              .toBe(1);
            expect(response.body.free[0]._id.localeCompare(deliveryOrder._id))
              .toBe(0);
          });

          test('Devuelve un albarán en facturas', () => {
            expect(response.body.inInvoices.count)
              .toBe(1);
            expect(response.body.inInvoices.data.length)
              .toBe(1);
            expect(response.body.inInvoices.data[0]._id.localeCompare(deliveryOrder2._id))
              .toBe(0);
          });
        });

        describe('Con limit y offset 1', () => {
          let response;
          let deliveryOrder3;

          before(async () => {
            deliveryOrder3 = await DeliveryOrderModel.create({
              ...deliveryOrder2Mock,
              provider: provider._id,
            });
            await DeliveryOrderModel.create({
              ...deliveryOrder2Mock,
              provider: provider._id,
            });
          });

          beforeAll(done => {
            supertest(app)
              .get(`/deliveryorders?provider=${deliveryOrder.provider}&offset=1&limit=2`)
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

          test('Devuelve un albarán en facturas', () => {
            expect(response.body.inInvoices.count)
              .toBe(3);
            expect(response.body.inInvoices.data.length)
              .toBe(2);
            expect(response.body.inInvoices.data[0]._id.localeCompare(deliveryOrder3._id))
              .toBe(0);
          });
        });
      });
    });
  });

  describe('POST /deliveryorders', () => {
    const PATH = '/deliveryorders';
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

      describe('No se envía proveedor', () => {
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
          expect(response.statusCode)
            .toBe(400);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new deliveryOrderErrors.DeliveryOrderMissing().message);
        });
      });

      describe('El proveedor no existe', () => {
        let response;

        const dataSend = {
          provider: '5f148a51702f6d366d76d9c4',
        };

        before(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send(dataSend)
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
            .toBe(new deliveryOrderErrors.DeliveryOrderProviderNotFound().message);
        });
      });

      describe('Se crea el albarán', () => {
        let response;
        let provider;

        before(() => ProviderModel.create({
          name: 'Mi proveedor',
          hasCanal: true,
        })
          .then(providerCreated => {
            provider = providerCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({ provider: provider._id })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.statusCode)
            .toBe(200);
        });

        test('Devuelve un albarán en facturas', () => {
          expect(response.body._id)
            .toBeTruthy();
          expect(response.body.nameProvider)
            .toBe(provider.name);
          expect(`${response.body.provider}`)
            .toBe(provider._id.toString());
          expect(response.body.totals.iva)
            .toBe(0);
          expect(response.body.totals.rate)
            .toBe(0);
          expect(response.body.totals.re)
            .toBe(0);
          expect(response.body.totals.taxBase)
            .toBe(0);
          expect(response.body.totals.total)
            .toBe(0);
        });
      });
    });
  });

  describe('PATCH /deliveryorders/:id', () => {
    const PATH = '/deliveryorders';
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch(`${PATH}/5f14857d3ae0d32b417e8d0c`)
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

      describe('El albarán no existe', () => {
        let response;

        before(done => {
          supertest(app)
            .patch(`${PATH}/5f14857d3ae0d32b417e8d0c`)
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
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('Se actualiza la fecha del albarán', () => {
        let response;
        const date = Date.now();
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        before(done => {
          supertest(app)
            .patch(`${PATH}/${deliveryOrder._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ date })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.statusCode)
            .toBe(200);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body._id)
            .toBe(deliveryOrder._id.toString());
          expect(response.body.date)
            .toBe(date);
        });
      });

      describe('Se actualiza los totales del albarán', () => {
        let response;
        const date = Date.now();
        let deliveryOrder;
        const totals = {
          total: 10,
          iva: 20,
          rate: 11,
          re: 2,
          taxBase: 32,
        };

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        before(done => {
          supertest(app)
            .patch(`${PATH}/${deliveryOrder._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ totals })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.statusCode)
            .toBe(200);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body._id)
            .toBe(deliveryOrder._id.toString());
          expect(response.body.totals.toString())
            .toBe(totals.toString());
        });
      });

      describe('Se actualiza la nota del albarán', () => {
        let response;
        const note = 'Esto es una nota';
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        before(done => {
          supertest(app)
            .patch(`${PATH}/${deliveryOrder._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ note })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.statusCode)
            .toBe(200);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body._id)
            .toBe(deliveryOrder._id.toString());
          expect(response.body.note)
            .toBe(note);
        });
      });

      describe('El proveedor no existe', () => {
        let response;

        const dataSend = {
          provider: '5f148a51702f6d366d76d9c4',
        };

        before(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send(dataSend)
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
            .toBe(new deliveryOrderErrors.DeliveryOrderProviderNotFound().message);
        });
      });

      describe('El proveedor existe', () => {
        let response;
        let provider;

        before(() => ProviderModel.create({ name: 'Mi proveedor' })
          .then(providerCreated => {
            provider = providerCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({ provider: provider._id })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.statusCode)
            .toBe(200);
        });

        test('Devuelve un albarán en facturas', () => {
          expect(response.body._id)
            .toBeTruthy();
          expect(response.body.nameProvider)
            .toBe(provider.name);
          expect(`${response.body.provider}`)
            .toBe(provider._id.toString());
          expect(response.body.totals.iva)
            .toBe(0);
          expect(response.body.totals.rate)
            .toBe(0);
          expect(response.body.totals.re)
            .toBe(0);
          expect(response.body.totals.taxBase)
            .toBe(0);
          expect(response.body.totals.total)
            .toBe(0);
        });
      });
    });
  });

  describe('DELETE /deliveryorders/:id', () => {
    const PATH = '/deliveryorders';
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .delete(`${PATH}/5f14857d3ae0d32b417e8d0c`)
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

      describe('El albarán no existe', () => {
        let response;

        before(done => {
          supertest(app)
            .delete(`${PATH}/5f14857d3ae0d32b417e8d0c`)
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
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('El albarán no puede eliminarse', () => {
        let response;
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrder2Mock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        before(done => {
          supertest(app)
            .delete(`${PATH}/${deliveryOrder._id}`)
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
            .toBe(new deliveryOrderErrors.DeliveryOrderDeleteWithInvoice().message);
        });
      });

      describe('Se elimina el albarán correctamente', () => {
        let response;
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        before(done => {
          supertest(app)
            .delete(`${PATH}/${deliveryOrder._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 204', () => {
          expect(response.statusCode)
            .toBe(204);
        });
      });
    });
  });

  describe('GET /deliveryorders/:id', () => {
    const PATH = '/deliveryorders';
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(`${PATH}/5f14857d3ae0d32b417e8d0c`)
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

      describe('No existe el albarán', () => {
        let response;

        before(done => {
          supertest(app)
            .get(`${PATH}/5f14857d3ae0d32b417e8d0c`)
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

        test('El mensaje de error es el correcto', () => {
          expect(response.body.message)
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('Devuelve correctamente el albarán', () => {
        let deliveryOrder;
        let response;

        before(() => DeliveryOrderModel.create({
          ...deliveryOrder2Mock,
          hasCanal: true,
        })
          .then(created => {
            deliveryOrder = created;
          }));

        before(done => {
          supertest(app)
            .get(`${PATH}/${deliveryOrder._id}`)
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

        test('La respuesta es correcta', () => {
          expect(response.body._id.localeCompare(deliveryOrder._id))
            .toBe(0);
          expect(response.body.provider)
            .toBe(deliveryOrder2Mock.provider);
          expect(response.body.nameProvider)
            .toBe(deliveryOrder2Mock.nameProvider);
          expect(response.body.products.length)
            .toBe(1);
          expect(response.body.nOrder)
            .toBe(deliveryOrder2Mock.nOrder);
          expect(response.body.invoice)
            .toBe(deliveryOrder2Mock.invoice);
          expect(response.body.hasCanal)
            .toBe(true);
        });
      });
    });
  });

  describe('POST /deliveryorders/:id/product', () => {
    const PATH = id => `/deliveryorders/${id}/product`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(PATH('5f14857d3ae0d32b417e8d0c'))
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

      describe('El albarán no existe', () => {
        let response;

        before(done => {
          supertest(app)
            .post(PATH('5f14857d3ae0d32b417e8d0c'))
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
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('El albarán no tiene fecha', () => {
        let response;
        let deliveryOrder;

        before(done => {
          const mock = { ...deliveryOrderMock };
          delete mock.date;
          DeliveryOrderModel.create(mock)
            .then(deliveryOrderCreated => {
              deliveryOrder = deliveryOrderCreated;
              done();
            });
        });

        before(done => {
          supertest(app)
            .post(PATH(deliveryOrder._id))
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
            .toBe(new deliveryOrderErrors.DeliveryOrderDateRequired().message);
        });
      });

      describe('El producto no existe', () => {
        let response;
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        before(done => {
          supertest(app)
            .post(PATH(deliveryOrder._id))
            .set('Authorization', `Bearer ${token}`)
            .send({
              quantity: 8,
              price: 3.3,
              product: '5f14857d3ae0d32b417e8d0c',
            })
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

      describe('No se envía producto', () => {
        let response;
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        before(done => {
          supertest(app)
            .post(PATH(deliveryOrder._id))
            .set('Authorization', `Bearer ${token}`)
            .send({
              quantity: 8,
              price: 3.3,
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
            .toBe(new deliveryOrderErrors.DeliveryOrderMissing().message);
        });
      });

      describe('El producto existe', () => {
        let deliveryOrder;
        let product;

        before(async () => {
          deliveryOrder = await DeliveryOrderModel.create(deliveryOrderMock);
          product = await ProductModel.create(productMock);
        });

        describe('No se envia cantidad', () => {
          let response;

          before(done => {
            supertest(app)
              .post(PATH(deliveryOrder._id))
              .set('Authorization', `Bearer ${token}`)
              .send({
                product: product._id,
                price: 3.3,
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
              .toBe(new deliveryOrderErrors.DeliveryOrderMissing().message);
          });
        });

        describe('No se envia precio', () => {
          let response;

          before(done => {
            supertest(app)
              .post(PATH(deliveryOrder._id))
              .set('Authorization', `Bearer ${token}`)
              .send({
                product: product._id,
                quantity: 4,
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
              .toBe(new deliveryOrderErrors.DeliveryOrderMissing().message);
          });
        });

        describe('Se envían los datos correctos', () => {
          let response;
          let body;

          before(done => {
            body = {
              product: product._id,
              quantity: 4,
              price: 12,
              canal: '993',
            };
            supertest(app)
              .post(PATH(deliveryOrder._id))
              .set('Authorization', `Bearer ${token}`)
              .send(body)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(response.statusCode)
              .toBe(200);
          });

          test('Los datos enviados son correctos', () => {
            const productReceived = response.body.products[1];
            const rate = body.quantity * productMock.rate;
            const taxBase = rate + (body.price * body.quantity);
            const re = taxBase * productMock.re;
            const iva = taxBase * productMock.iva;
            expect(response.body.products.length)
              .toBe(2);
            expect(productReceived.code)
              .toBe(productMock.code);
            expect(productReceived.name)
              .toBe(productMock.name);
            expect(productReceived.rate)
              .toBe(rate);
            expect(productReceived.iva)
              .toBe(iva);
            expect(productReceived.price)
              .toBe(body.price);
            expect(productReceived._id)
              .toBe(product._id.toString());
            expect(productReceived.quantity)
              .toBe(body.quantity);
            expect(productReceived.re)
              .toBe(re);
            expect(productReceived.taxBase)
              .toBe(taxBase);
            expect(productReceived.total)
              .toBe(taxBase + re + iva);
            expect(response.body.totals.iva)
              .toBe(8.85);
            expect(response.body.totals.rate)
              .toBe(3.716);
            expect(response.body.totals.re)
              .toBe(1.7);
            expect(response.body.totals.taxBase)
              .toBe(119.22);
            expect(response.body.totals.total)
              .toBe(129.77);
          });
        });

        describe('Se añade un producto sin tasa', () => {
          let response;
          let productNoRate;

          before(() => ProductModel.create(productNoRateMock)
            .then(productCreated => {
              productNoRate = productCreated;
            }));

          before(done => {
            supertest(app)
              .post(PATH(deliveryOrder._id))
              .set('Authorization', `Bearer ${token}`)
              .send({
                product: productNoRate._id,
                quantity: 4,
                price: 12,
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
        });

        describe('Se envían los datos correctos y tiene precio anterior', () => {
          let response;
          let body;

          before(() => PriceModel.create({
            date: 1595096040000,
            product: product._id,
            price: 1,
          }));

          before(done => {
            body = {
              product: product._id,
              quantity: 4,
              price: 12,
            };
            supertest(app)
              .post(PATH(deliveryOrder._id))
              .set('Authorization', `Bearer ${token}`)
              .send(body)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(response.statusCode)
              .toBe(200);
          });
        });
      });
    });
  });

  describe('PUT /deliveryorders/:id/product', () => {
    const PATH = (id, index) => `/deliveryorders/${id}/product/${index}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .put(PATH('5f14857d3ae0d32b417e8d0c', 0))
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

      describe('El albarán no existe', () => {
        let response;

        before(done => {
          supertest(app)
            .put(PATH('5f14857d3ae0d32b417e8d0c', 0))
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
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('El albarán existe', () => {
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        describe('El índice del producto no existe', () => {
          let response;

          before(done => {
            supertest(app)
              .put(PATH(deliveryOrder._id, 1))
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
              .toBe(new deliveryOrderErrors.DeliveryOrderProductIndexNotFound().message);
          });
        });

        describe('El índice del producto es menor que 0', () => {
          let response;

          before(done => {
            supertest(app)
              .put(PATH(deliveryOrder._id, -1))
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
              .toBe(new deliveryOrderErrors.DeliveryOrderProductIndexNotFound().message);
          });
        });

        describe('El índice del producto existe', () => {
          describe('No se envía producto', () => {
            let response;
            before(done => {
              supertest(app)
                .put(PATH(deliveryOrder._id, 0))
                .set('Authorization', `Bearer ${token}`)
                .send({
                  quantity: 8,
                  price: 3.3,
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
                .toBe(new deliveryOrderErrors.DeliveryOrderMissing().message);
            });
          });
          describe('El producto no existe', () => {
            let response;

            before(done => {
              supertest(app)
                .put(PATH(deliveryOrder._id, 0))
                .set('Authorization', `Bearer ${token}`)
                .send({
                  quantity: 8,
                  price: 3.3,
                  product: '5f14857d3ae0d32b417e8d0c',
                })
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
          describe('El producto existe', () => {
            let product;

            before(async () => {
              product = await ProductModel.create(productMock);
            });

            describe('No se envia cantidad', () => {
              let response;

              before(done => {
                supertest(app)
                  .put(PATH(deliveryOrder._id, 0))
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    product: product._id,
                    price: 3.3,
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
                  .toBe(new deliveryOrderErrors.DeliveryOrderMissing().message);
              });
            });

            describe('No se envia precio', () => {
              let response;

              before(done => {
                supertest(app)
                  .put(PATH(deliveryOrder._id, 0))
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    product: product._id,
                    quantity: 4,
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
                  .toBe(new deliveryOrderErrors.DeliveryOrderMissing().message);
              });
            });

            describe('Se envían los datos correctos', () => {
              let response;
              let body;

              before(done => {
                body = {
                  product: product._id,
                  quantity: 4,
                  price: 12,
                };
                supertest(app)
                  .put(PATH(deliveryOrder._id, 0))
                  .set('Authorization', `Bearer ${token}`)
                  .send(body)
                  .end((err, res) => {
                    response = res;
                    done();
                  });
              });

              test('Debería dar un 200', () => {
                expect(response.statusCode)
                  .toBe(200);
              });

              test('Los datos enviados son correctos', () => {
                const productReceived = response.body.products[0];
                const rate = body.quantity * productMock.rate;
                const taxBase = rate + (body.price * body.quantity);
                const re = taxBase * productMock.re;
                const iva = taxBase * productMock.iva;
                const total = taxBase + re + iva;
                expect(response.body.products.length)
                  .toBe(1);
                expect(productReceived.rate)
                  .toBe(roundNumber(rate, 3));
                expect(productReceived.iva)
                  .toBe(iva);
                expect(productReceived.price)
                  .toBe(body.price);
                expect(productReceived._id)
                  .toBe(product._id.toString());
                expect(productReceived.quantity)
                  .toBe(body.quantity);
                expect(productReceived.re)
                  .toBe(re);
                expect(productReceived.taxBase)
                  .toBe(taxBase);
                expect(productReceived.total)
                  .toBe(total);
                expect(response.body.totals.iva)
                  .toBe(roundNumber(iva, 2));
                expect(response.body.totals.rate)
                  .toBe(rate);
                expect(response.body.totals.re)
                  .toBe(roundNumber(re, 2));
                expect(response.body.totals.taxBase)
                  .toBe(roundNumber(taxBase, 2));
                expect(response.body.totals.total)
                  .toBe(roundNumber(total, 2));
              });
            });

            describe('El albarán pertenece a una factura', () => {
              let response;
              let deliveryOrderInvoice;

              before(async () => {
                deliveryOrderInvoice = await DeliveryOrderModel.create(deliveryOrder2Mock);
                const invoice = await InvoiceModel.create({
                  deliveryOrders: [deliveryOrderInvoice._id],
                });
                await DeliveryOrderModel.updateOne(
                  { _id: deliveryOrderInvoice._id },
                  { invoice: invoice._id },
                );
              });

              before(done => {
                supertest(app)
                  .put(PATH(deliveryOrderInvoice._id, 0))
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    product: product._id,
                    quantity: 4,
                    price: 12,
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
            });
          });
        });
      });
    });
  });

  describe('DELETE /deliveryorders/:id/product', () => {
    const PATH = (id, index) => `/deliveryorders/${id}/product/${index}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .delete(PATH('5f14857d3ae0d32b417e8d0c', 0))
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

      describe('El albarán no existe', () => {
        let response;

        before(done => {
          supertest(app)
            .delete(PATH('5f14857d3ae0d32b417e8d0c', 0))
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
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('El albarán existe', () => {
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(deliveryOrderCreated => {
            deliveryOrder = deliveryOrderCreated;
          }));

        describe('El índice del producto no existe', () => {
          let response;

          before(done => {
            supertest(app)
              .delete(PATH(deliveryOrder._id, 1))
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
              .toBe(new deliveryOrderErrors.DeliveryOrderProductIndexNotFound().message);
          });
        });

        describe('El índice del producto existe', () => {
          describe('Se elemina el producto correctamente', () => {
            let response;
            before(done => {
              supertest(app)
                .delete(PATH(deliveryOrder._id, 0))
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

            test('La respuesta es correcta', () => {
              expect(response.body.products.length)
                .toBe(0);
              expect(response.body.totals.iva)
                .toBe(0);
              expect(response.body.totals.rate)
                .toBe(0);
              expect(response.body.totals.re)
                .toBe(0);
              expect(response.body.totals.taxBase)
                .toBe(0);
              expect(response.body.totals.total)
                .toBe(0);
            });
          });
        });
      });
    });
  });
});
