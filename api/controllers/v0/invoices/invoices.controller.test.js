const supertest = require('supertest');
const {
        mongoose,
        InvoiceModel,
        DeliveryOrderModel,
        ProviderModel,
        AutoIncrement,
        PaymentModel,
        BillingModel,
      } = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const {
        commonErrors,
        invoiceErrors,
        providerErrors,
      } = require('../../../../errors');
const {
        CONCEPT,
        TYPE_PAYMENT,
        COLUMNS_INVOICES,
      } = require('../../../../constants/index');
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
};

const invoiceMock = {
  deliveryOrders: [
    deliveryOrderMock, deliveryOrder2Mock,
  ],
  total: 75.48,
  iva: 6.8,
  re: 0.68,
  taxBase: 68,
  nameProvider: 'Primero',
  provider: '5f14857d3ae0d32b417e8d0c',
  dateRegister: 1596891828425.0,
  concept: 'Compras',
  dateInvoice: 1597410180000.0,
  nInvoice: '33',
  nOrder: 47,
  payment: {
    paymentDate: 1596891780000.0,
    type: 'Talón',
    numCheque: '888',
    paid: true,
    invoicesOrder: '47',
  },
};

const invoiceExpenseCreate = {
  concept: CONCEPT.ALQUILER,
  nInvoice: '2019/22',
  dateInvoice: 1596891780000,
  dateRegister: 1597410180000,
  total: 12.5,
  provider: '5f14857d3ae0d32b417e8d0c',
  re: 0.1,
  type: 'Talón',
  bookColumn: COLUMNS_INVOICES.ALQUILER,
};

const invoiceExpenseCreate2 = {
  concept: 'Luz',
  nInvoice: '2019/22',
  dateInvoice: 1596891780000,
  dateRegister: 1597410180000,
  total: 12.5,
  provider: '5f14857d3ae0d32b417e8d0c',
  type: 'Efectivo',
  paymentDate: 1597410180000,
  paid: true,
};

describe('InvoicesController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /invoices', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/invoices')
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

      describe('No se envía año', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/invoices')
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

        test('Devuelve el mensaje correcto', () => {
          expect(response.body.message)
            .toBe(new commonErrors.ParamNotValidError().message);
        });
      });

      describe('Sin facturas', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/invoices?year=2020')
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

        test('Devuelve un array', () => {
          expect(response.body)
            .toEqual([]);
        });
      });

      describe('Dispone de facturas', () => {
        let invoice;

        before(() => InvoiceModel.create(invoiceMock)
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        describe('No se pasa offset ni limit', () => {
          let response;

          before(done => {
            supertest(app)
              .get('/invoices?year=2020')
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
            expect(response.body.length)
              .toBe(1);
          });

          test('Los datos son correctos', () => {
            const json = JSON.parse(response.text)[0];
            expect(JSON.stringify(json._id))
              .toEqual(JSON.stringify(invoice._id));
            expect(json.nOrder)
              .toBe(invoice.nOrder);
            expect(json.total)
              .toBe(invoice.total);
            expect(json.dateInvoice)
              .toBe(invoice.dateInvoice);
          });
        });
      });
    });
  });

  describe('GET /invoices/short', () => {
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/invoices/short')
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

      describe('Sin facturas', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/invoices/short')
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

      describe('Dispone de facturas', () => {
        let invoice;
        const nOrder = 2;

        before(() => InvoiceModel.create({
          total: 295.74,
          dateInvoice: 1594474393373.0,
          nInoice: '22/2020',
          nOrder,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        describe('No se pasan parámetros', () => {
          let response;

          before(done => {
            supertest(app)
              .get('/invoices/short')
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
              .toEqual(JSON.stringify(invoice._id));
            expect(json.nOrder)
              .toBe(invoice.nOrder);
            expect(json.total)
              .toBe(invoice.total);
            expect(json.dateInvoice)
              .toBe(invoice.dateInvoice);
          });
        });

        describe('Filtrado por proveedor', () => {
          let response;
          const providerId = '5f2c421ae954416d614bd5e9';

          before(() => InvoiceModel.create({
            ...invoiceMock,
            provider: providerId,
            nOrder: 32,
          }));

          before(done => {
            supertest(app)
              .get(`/invoices/short?provider=${providerId}`)
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
            expect(response.body.length)
              .toBe(1);
          });

          test('Los datos son correctos', () => {
            const json = response.body[0];
            expect(json.nOrder)
              .toBe(32);
            expect(json.total)
              .toBe(invoiceMock.total);
            expect(json.dateInvoice)
              .toBe(invoiceMock.dateInvoice);
          });
        });

        describe('Ordenación de facturas', () => {
          let response;
          const provider = '5ed2cff6506bb0733669bbdd';

          before(async () => {
            const invoiceNoOrder = {
              ...invoiceMock,
              provider,
            };
            delete invoiceNoOrder.nOrder;
            await InvoiceModel.create(invoiceNoOrder);
          });

          before(() => InvoiceModel.create({
            ...invoiceMock,
            provider,
          }));
          before(() => InvoiceModel.create({
            ...invoiceMock,
            provider,
            nOrder,
          }));

          before(done => {
            supertest(app)
              .get(`/invoices/short?provider=${provider}`)
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

          test('Las facturas están ordenadas correctamente', () => {
            expect(response.body[0].nOrder)
              .toBeUndefined();
            expect(response.body[1].nOrder)
              .toBe(invoiceMock.nOrder);
            expect(response.body[2].nOrder)
              .toBe(nOrder);
          });
        });
      });
    });
  });

  describe('GET /invoices/:id', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/invoices/5ef26172ccfd9d1541b870be')
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

      describe('El id de la factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .get('/invoices/5ef26172ccfd9d1541b870be')
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
      });

      describe('Devuelve los datos de la factura ', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create(invoiceMock)
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .get(`/invoices/${invoice._id}`)
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

        test('Los datos son correctos', () => {
          const bodyResponse = response.body;
          expect(bodyResponse.provider)
            .toBe(invoiceMock.provider);
          expect(bodyResponse.name)
            .toBe(invoiceMock.name);
          expect(bodyResponse.deliveryOrders.length)
            .toBe(invoiceMock.deliveryOrders.length);
        });
      });
    });
  });

  describe('POST /invoices', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post('/invoices')
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

      describe('No se envía concepto', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/invoices')
            .set('Authorization', `Bearer ${token}`)
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
      });

      describe('No se envía albaranes', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/invoices')
            .set('Authorization', `Bearer ${token}`)
            .send({
              concept: CONCEPT.COMPRAS,
              bookColumn: COLUMNS_INVOICES.COMPRAS,
            })
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
            .toBe(new invoiceErrors.InvoiceMissingDeliveryOrders().message);
        });
      });

      describe('El abarán no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/invoices')
            .set('Authorization', `Bearer ${token}`)
            .send({
              concept: CONCEPT.COMPRAS,
              deliveryOrders: ['5f188ec1deae8d5c1b549336'],
              bookColumn: 'COMPRAS',
            })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });
      });

      describe('Se crea la factura correctamente', () => {
        let response;
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(orderCreated => {
            deliveryOrder = orderCreated;
          }));

        describe('Se crea la factura de un albarán', () => {
          beforeAll(done => {
            supertest(app)
              .post('/invoices/')
              .send({
                concept: CONCEPT.COMPRAS,
                deliveryOrders: [deliveryOrder._id],
                bookColumn: 'COMPRAS',
              })
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

          test('Devuelve los datos correctos', () => {
            const deliveryOrderResponse = response.body.deliveryOrders[0];
            expect(response.body.concept)
              .toBe(CONCEPT.COMPRAS);
            expect(deliveryOrder._id.toString())
              .toBe(deliveryOrderResponse._id);
            expect(response.body.iva)
              .toBe(deliveryOrder.iva);
            expect(response.body.nameProvider)
              .toBe(deliveryOrder.nameProvider);
            expect(response.body.provider)
              .toBe(deliveryOrder.provider);
            expect(response.body.re)
              .toBe(deliveryOrder.re);
            expect(response.body.taxBase)
              .toBe(deliveryOrder.taxBase);
            expect(response.body.total)
              .toBe(deliveryOrder.total);
          });
        });

        describe('Se crea la factura de dos albaranes', () => {
          let deliveryOrder2;
          before(() => DeliveryOrderModel.create(deliveryOrder2Mock)
            .then(orderCreated => {
              deliveryOrder2 = orderCreated;
            }));

          beforeAll(done => {
            supertest(app)
              .post('/invoices/')
              .send({
                concept: CONCEPT.COMPRAS,
                deliveryOrders: [deliveryOrder._id, deliveryOrder2._id],
                bookColumn: 'COMPRAS',
              })
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

          test('Devuelve los datos correctos', () => {
            const deliveryOrderResponse = response.body.deliveryOrders[0];
            const deliveryOrder2Response = response.body.deliveryOrders[1];
            expect(response.body.concept)
              .toBe(CONCEPT.COMPRAS);
            expect(deliveryOrder._id.toString())
              .toBe(deliveryOrderResponse._id);
            expect(deliveryOrder2._id.toString())
              .toBe(deliveryOrder2Response._id);
            expect(response.body.iva)
              .toBe(roundNumber(deliveryOrder.iva + deliveryOrder2.iva, 2));
            expect(response.body.nameProvider)
              .toBe(deliveryOrder.nameProvider);
            expect(response.body.provider)
              .toBe(deliveryOrder.provider);
            expect(response.body.re)
              .toBe(roundNumber(deliveryOrder.re + deliveryOrder2.re, 2));
            expect(response.body.taxBase)
              .toBe(roundNumber(deliveryOrder.taxBase + deliveryOrder2.taxBase, 2));
            expect(response.body.total)
              .toBe(roundNumber(deliveryOrder.total + deliveryOrder2.total, 2));
          });
        });
      });
    });
  });

  describe('POST /invoices/expense', () => {
    const PATH = '/invoices/expense';

    afterAll(() => testDB.cleanAll());
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

      describe('Faltan parámetros', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({ concept: CONCEPT.ALQUILER })
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
            .toBe(new invoiceErrors.InvoiceParamsMissing().message);
        });
      });

      describe('El proveedor no existe', () => {
        let response;

        beforeAll(done => {
          const invoiceData = { ...invoiceExpenseCreate };
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send(invoiceData)
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
            .toBe(new providerErrors.ProviderIdNotFound().message);
        });
      });

      describe('El proveedor existe', () => {
        let provider;
        const nameProvider = 'Nombre';
        let invoiceWithProvider;

        beforeAll(() => ProviderModel.create({ name: nameProvider })
          .then(providerCreated => {
            provider = providerCreated;
            invoiceWithProvider = {
              ...invoiceExpenseCreate,
              provider: provider._id,
              nameProvider,
            };
          }));

        describe.each([
          'concept', 'dateInvoice', 'type', 'dateRegister', 'total', 'provider', 'bookColumn',
        ])('No se envía %s', (item => {
          let response;

          beforeAll(done => {
            const invoiceData = { ...invoiceWithProvider };
            delete invoiceData[item];
            supertest(app)
              .post(PATH)
              .set('Authorization', `Bearer ${token}`)
              .send(invoiceData)
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
              .toBe(new invoiceErrors.InvoiceParamsMissing().message);
          });
        }));

        describe.each([
          'sin re',
          'con re',
          'con paymentDate',
        ])('Se crea la factura correctamente %s', type => {
          let response;
          let invoice;

          beforeAll(done => {
            invoice = type.includes('re')
              ? type === 'sin re'
                ? invoiceWithProvider
                : {
                  ...invoiceWithProvider,
                  re: 2,
                  nInvoice: 22,
                }
              : {
                ...invoiceWithProvider,
                type: 'Efectivo',
                paymentDate: 1596632580000,
                paid: true,
                nInvoice: 33,
              };

            supertest(app)
              .post(PATH)
              .send(invoice)
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

          test('Devuelve los datos correctos', () => {
            expect(response.body.concept)
              .toBe(invoiceExpenseCreate.concept);
            expect(response.body.nameProvider)
              .toBe(nameProvider);
            expect(response.body.provider)
              .toBe(provider._id.toString());
            expect(response.body.re)
              .toBe(invoice.re);
            expect(response.body.total)
              .toBe(invoice.total);
            expect(response.body.bookColumn)
              .toBe(invoice.bookColumn);
          });
        });
      });
    });
  });

  describe('PATCH /invoices/:id', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch('/invoices/5ef26172ccfd9d1541b870be')
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

      describe('No contiene datos de la factura ni totales', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({})
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}`)
            .set('Authorization', `Bearer ${token}`)
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
      });

      describe('Actualiza los campos', () => {
        let response;
        let invoice;
        const invoiceData = {
          dateInvoice: 1594062299563,
          dateRegister: 1594062299563,
          nInvoice: '333/2203',
        };

        const invoiceTotals = {
          total: 12,
          iva: 10,
          re: 8,
          rate: 2.2,
          taxBase: 3.6,
        };

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        const testData = () => {
          const { data } = JSON.parse(response.text);
          expect(data.dateInvoice)
            .toBe(invoiceData.dateInvoice);
          expect(data.dateRegister)
            .toBe(invoiceData.dateRegister);
          expect(data.nInvoice)
            .toBe(invoiceData.nInvoice);
        };

        const testTotals = () => {
          const { totals } = response.body;
          expect(totals.total)
            .toBe(invoiceTotals.total);
          expect(totals.iva)
            .toBe(invoiceTotals.iva);
          expect(invoiceTotals.re)
            .toBe(invoiceTotals.re);
          expect(invoiceTotals.rate)
            .toBe(invoiceTotals.rate);
          expect(invoiceTotals.taxBase)
            .toBe(invoiceTotals.taxBase);
        };

        describe('Se actualiza data y totals', () => {
          beforeAll(done => {
            supertest(app)
              .patch(`/invoices/${invoice._id}`)
              .send({
                data: invoiceData,
                totals: invoiceTotals,
              })
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

          test('Se ha actualizado data', () => {
            testData();
          });

          test('Se ha actualizado los totales', () => {
            testTotals();
          });
        });

        describe('Se actualiza data', () => {
          beforeAll(done => {
            supertest(app)
              .patch(`/invoices/${invoice._id}`)
              .send({
                data: invoiceData,
              })
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

          test('Se han actualizado data', () => {
            testData();
          });
        });

        describe('Se actualiza los totales', () => {
          beforeAll(done => {
            supertest(app)
              .patch(`/invoices/${invoice._id}`)
              .send({
                totals: invoiceTotals,
              })
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

          test('Se ha actualizado los totales', () => {
            testTotals();
          });
        });
      });
    });
  });

  describe('DELETE /invoices/:id', () => {
    const PATH = id => `/invoices/${id}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .delete(PATH('5ef26172ccfd9d1541b870be'))
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

      describe('El id de la factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .delete(PATH('5ef26172ccfd9d1541b870be'))
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
      });

      describe('El id de la factura existe y está confirmada', () => {
        let response;
        let invoice;

        beforeAll(() => InvoiceModel.create(invoiceMock)
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        describe('No es la ultima factura', () => {
          beforeAll(() => AutoIncrement.create({
            name: 'invoice2020',
            seq: invoiceMock.nOrder + 1,
          }));

          afterAll(() => testDB.clean('AutoIncrement'));

          beforeAll(done => {
            supertest(app)
              .delete(PATH(invoice._id))
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
              .toBe(new invoiceErrors.InvoiceNoRemovable().message);
          });
        });

        describe('El pago está fusionado', () => {
          beforeAll(() => PaymentModel.create({
            invoices: [invoice._id],
            invoiceDate: invoice.invoiceDate,
            merged: true,
          }));

          beforeAll(() => PaymentModel.create({
            invoices: [invoice._id, '5fad85b6f8f8014e6c448103'],
            invoiceDate: invoice.invoiceDate,
          }));

          afterAll(() => testDB.clean('payments'));

          beforeAll(done => {
            supertest(app)
              .delete(PATH(invoice._id))
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
              .toBe(new invoiceErrors.PaymentMerged().message);
          });
        });

        describe('Es la última factura', () => {
          beforeAll(() => AutoIncrement.create({
            name: 'invoice2020',
            seq: invoiceMock.nOrder,
          }));

          beforeAll(() => BillingModel.create({
            provider: invoiceMock.provider,
            year: '2020',
            annual: invoiceMock.total,
            invoicesTrimester3: [
              { invoice: invoice._id },
            ],
            trimesters: [0, 0, invoiceMock.total, 0],
          }));

          beforeAll(() => PaymentModel.create({
            invoices: [invoice._id],
            invoiceDate: invoice.invoiceDate,
          }));

          afterAll(() => testDB.clean('AutoIncrement'));

          beforeAll(done => {
            supertest(app)
              .delete(PATH(invoice._id))
              .set('Authorization', `Bearer ${token}`)
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

      describe('La factura no está confirmada', () => {
        let response;
        let invoice;

        beforeAll(async () => {
          const invoiceData = {
            ...invoiceMock,
          };
          delete invoiceData.nOrder;

          await InvoiceModel.create(invoiceData)
            .then(invoiceCreated => {
              invoice = invoiceCreated;
            });
        });

        beforeAll(done => {
          supertest(app)
            .delete(PATH(invoice._id))
            .set('Authorization', `Bearer ${token}`)
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

  describe('PATCH /invoices/:id/confirm', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch('/invoices/5ef26172ccfd9d1541b870be/confirm')
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

      describe('El id de la factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch('/invoices/5ef26172ccfd9d1541b870be/confirm')
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
      });

      describe('No tiene fecha de factura', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({})
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({ type: 'Tarjeta' })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(422);
        });
      });

      describe('No tiene tipo de pago', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
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
      });

      describe('La fecha de factura es incorrecta', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              type: 'Tarjeta',
              paymentDate: 'test',
            })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(422);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new commonErrors.DateNotValid().message);
        });
      });

      describe('El pago es en efectivo y no tiene fecha', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              type: TYPE_PAYMENT.CASH,
            })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 422', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(422);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new commonErrors.DateNotValid().message);
        });
      });

      describe('La factura ya tiene número de orden', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
          nOrder: 3,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({ type: 'Tarjeta' })
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
            .toBe(new invoiceErrors.InvoiceWithOrderNumber().message);
        });
      });

      describe('Asigna el número de orden', () => {
        let response;
        let invoice;

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
          total: 10,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({ type: 'Tarjeta' })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        afterAll(() => testDB.clean('AutoIncrement'));

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();
          expect(response.statusCode)
            .toBe(200);
        });

        test('Se ha asignado un número de order', () => {
          expect(response.body.data.nOrder)
            .toBe(1);
        });

        test('Se establecen los datos de pago', () => {
          expect(response.body.payment.type)
            .toBe('Tarjeta');
          expect(response.body.payment.paymentDate)
            .toBeUndefined();
          expect(response.body.payment.paid)
            .toBe(false);
        });
      });

      describe('Asigna el número de orden y contiene albaranes', () => {
        let response;
        let invoice;
        let deliveryOrder;

        before(() => DeliveryOrderModel.create(deliveryOrderMock)
          .then(created => {
            deliveryOrder = created;
          }));

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
          deliveryOrders: [deliveryOrder],
          total: 10,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({ type: 'Tarjeta' })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        afterAll(() => testDB.clean('AutoIncrement'));

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();
          expect(response.statusCode)
            .toBe(200);
        });

        test('Se ha asignado un número de order', () => {
          expect(response.body.data.nOrder)
            .toBe(1);
        });

        test('Se establecen los datos de pago', () => {
          expect(response.body.payment.type)
            .toBe('Tarjeta');
          expect(response.body.payment.paymentDate)
            .toBeUndefined();
          expect(response.body.payment.paid)
            .toBe(false);
        });
      });

      describe('Asigna el número de orden con pago en efectivo', () => {
        let response;
        let invoice;
        const paymentDate = Date.now();

        before(() => InvoiceModel.create({
          dateInvoice: Date.now(),
          total: 10,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/invoices/${invoice._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              type: TYPE_PAYMENT.CASH,
              paymentDate,
            })
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

        test('Se ha asignado un número de order', () => {
          expect(response.body.data.nOrder)
            .toBe(1);
        });

        test('Se establecen los datos de pago', () => {
          expect(response.body.payment.type)
            .toBe('Efectivo');
          expect(response.body.payment.paymentDate)
            .toBe(paymentDate);
        });

        test('El pago se marca como pagado', () => {
          expect(response.body.payment.paid)
            .toBe(true);
        });
      });
    });
  });

  describe('GET /invoices/export/:year', () => {
    const PATH = '/invoices/export/:year';
    afterAll(() => testDB.cleanAll());
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH.replace(':year', 2000))
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
            .get(PATH.replace(':year', 'error'))
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
            .toBe(new commonErrors.ParamNotValidError().message);
        });
      });

      describe('La petición se procesa correctamente', () => {
        let response;

        before(() => InvoiceModel.create(invoiceExpenseCreate));

        beforeAll(done => {
          supertest(app)
            .get(PATH.replace(':year', '2020'))
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
  describe('PATCH /invoices/expense', () => {
    const PATH = (a, b) => `/invoices/swap/${a}/${b}`;

    afterAll(() => testDB.cleanAll());
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch(PATH('5ea48dc376443fb4b0a7cb00', '5f7e133b4ccd161fef3f5786'))
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

      describe('Los ids no existen', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch(PATH('5ea48dc376443fb4b0a7cb00', '5f7e133b4ccd161fef3f5786'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('Se intercambian los números de orden', () => {
        let response;
        let invoiceA;
        let invoiceB;

        beforeAll(async () => {
          await InvoiceModel.create(invoiceMock)
            .then(created => {
              invoiceA = created;
            });
          await InvoiceModel.create(invoiceExpenseCreate)
            .then(created => {
              invoiceB = created;
            });
        });

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoiceA._id, invoiceB._id))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 204', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(204);
        });
      });
    });
  });
});
