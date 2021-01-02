const supertest = require('supertest');
const {
  mongoose,
  ClientModel,
  ClientInvoiceModel,
  AutoIncrement,
} = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const {
  commonErrors,
  invoiceErrors,
  clientErrors,
} = require('../../../../errors');

const invoiceMock = {
  taxBase: 200.73,
  iva: 95.01,
  total: 295.74,
  date: 1594474393373,
  nInvoice: '20-22',
  deliveryOrders: [
    {
      date: 1609439904890,
      products: [
        {
          name: 'Producto',
          weight: 112.2,
          unit: 'Kg',
          price: 1.23,
          total: 198.23,
        },
      ],
    },

  ],
};

describe('ClientInvoicesController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('POST /client/invoices', () => {
    const PATH = '/client/invoices';
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

      describe('El cliente no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .send({
              client: '5f7e138c15e88854b95b3cad',
            })
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();
          expect(response.status)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new clientErrors.ClientIdNotFound().message);
        });
      });

      describe('Se crea la factura correctamente', () => {
        let response;
        let client;

        before(() => ClientModel.create({
          name: 'Cliente',
        })
          .then(clientCreated => {
            client = clientCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .send({
              client: client._id,
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

        test('Devuelve un id', () => {
          expect(response.body.id)
            .toBeTruthy();
        });
      });
    });
  });

  describe('GET /client/invoices/short', () => {
    const PATH = '/client/invoices/short';
    before(() => testDB.clean());

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

      describe('El cliente no existe', () => {
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

        test('Debería dar un 404', () => {
          expect(response.status)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new clientErrors.ClientIdNotFound().message);
        });
      });

      describe('El cliente existe', () => {
        let response;
        let client;

        before(() => ClientModel.create({ name: 'Cliente' })
          .then(clientCreated => {
            client = clientCreated;
          }));

        describe('Sin facturas', () => {
          before(done => {
            supertest(app)
              .get(`${PATH}?client=${client._id}`)
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

          test('No devuelve facturas', () => {
            expect(response.body.count)
              .toBe(0);
            expect(response.body.invoices.length)
              .toBe(0);
          });
        });

        describe('Dispone de facturas', () => {
          before(() => ClientInvoiceModel.create({
            client: client._id,
            date: new Date().getTime(),
          }));
          before(() => ClientInvoiceModel.create({
            ...invoiceMock,
            client: client._id,
          }));

          before(done => {
            supertest(app)
              .get(`${PATH}?client=${client._id}&offset=1&limit=1`)
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

          test('Devuelve las facturas', () => {
            expect(response.body.count)
              .toBe(2);
            expect(response.body.invoices[0].date)
              .toBe(invoiceMock.date);
            expect(response.body.invoices[0].total)
              .toBe(invoiceMock.total);
            expect(response.body.invoices[0].nInvoice)
              .toBe(invoiceMock.nInvoice);
          });
        });
      });
    });
  });

  describe('GET /client/invoices', () => {
    const PATH = '/client/invoices';
    before(() => testDB.clean());

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

      let client;

      before(() => ClientModel.create({ name: 'Cliente' })
        .then(clientCreated => {
          client = clientCreated;
        }));

      describe('El año no es válido', () => {
        let response;
        before(done => {
          supertest(app)
            .get(`${PATH}?year=asd`)
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

        test('No devuelve facturas', () => {
          expect(response.body.message)
            .toBe(new commonErrors.ParamNotValidError().message);
        });
      });

      describe('Sin facturas', () => {
        let response;
        before(done => {
          supertest(app)
            .get(`${PATH}?year=2020`)
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

        test('No devuelve facturas', () => {
          expect(response.body.length)
            .toBe(0);
        });
      });

      describe('Dispone de facturas', () => {
        let response;
        before(() => ClientInvoiceModel.create({
          client: client._id,
          date: 1609355546762,
        }));

        before(() => ClientInvoiceModel.create({
          ...invoiceMock,
          client: client._id,
        }));

        before(done => {
          supertest(app)
            .get(`${PATH}?year=2020`)
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

        test('Devuelve las facturas', () => {
          expect(response.body.length)
            .toBe(2);
          expect(response.body[1].date)
            .toBe(invoiceMock.date);
          expect(response.body[1].total)
            .toBe(invoiceMock.total);
          expect(response.body[1].nInvoice)
            .toBe(invoiceMock.nInvoice);
        });
      });
    });
  });

  describe('GET /client/invoices/:id', () => {
    const PATH = id => `/client/invoices/${id}`;
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH('none'))
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

      let client;

      before(() => ClientModel.create({ name: 'Cliente' })
        .then(clientCreated => {
          client = clientCreated;
        }));

      describe('La factura no existe', () => {
        let response;
        before(done => {
          supertest(app)
            .get(PATH('5ed7e0548eb012d630aa258c'))
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

        test('No devuelve facturas', () => {
          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('Devuelve los datos de la factura', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          ...invoiceMock,
          client: client._id,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        before(done => {
          supertest(app)
            .get(PATH(invoice._id))
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

        test('Los datos son correctos', () => {
          expect(response.body.client)
            .toBe(client._id.toString());
          expect(response.body.date)
            .toBe(invoiceMock.date);
          expect(response.body.nInvoice)
            .toBe(invoiceMock.nInvoice);
          expect(response.body.total)
            .toBe(invoiceMock.total);
          // TODO
          /* expect(response.body.taxBase)
            .toBe(invoiceMock.taxBase);
          expect(response.body.iva)
            .toBe(invoiceMock.iva); */
          expect(response.body.deliveryOrders[0].date)
            .toBe(invoiceMock.deliveryOrders[0].date);
          expect(response.body.deliveryOrders[0].products[0].name)
            .toBe(invoiceMock.deliveryOrders[0].products[0].name);
          expect(response.body.deliveryOrders[0].products[0].weight)
            .toBe(invoiceMock.deliveryOrders[0].products[0].weight);
          expect(response.body.deliveryOrders[0].products[0].unit)
            .toBe(invoiceMock.deliveryOrders[0].products[0].unit);
          expect(response.body.deliveryOrders[0].products[0].price)
            .toBe(invoiceMock.deliveryOrders[0].products[0].price);
          expect(response.body.deliveryOrders[0].products[0].total)
            .toBe(invoiceMock.deliveryOrders[0].products[0].total);
        });
      });
    });
  });

  describe('PATCH /client/invoices/:id', () => {
    const PATH = id => `/client/invoices/${id}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch(PATH('5ef26172ccfd9d1541b870be'))
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

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch(PATH('5f761ae5a7d8986bc28ff7f4'))
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
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('No contiene fecha de la factura ni totales', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({})
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoice._id))
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
        const date = 1594062299563;

        const invoiceTotals = {
          total: 12,
          iva: 10,
          taxBase: 3.6,
        };

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        const testData = () => {
          expect(response.body.date)
            .toBe(date);
        };

        const testTotals = () => {
          const { totals } = response.body;
          expect(totals.total)
            .toBe(invoiceTotals.total);
          expect(totals.iva)
            .toBe(invoiceTotals.iva);
          expect(invoiceTotals.taxBase)
            .toBe(invoiceTotals.taxBase);
        };

        describe('Se actualiza data y totals', () => {
          beforeAll(done => {
            supertest(app)
              .patch(PATH(invoice._id))
              .send({
                date,
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

        describe('Se actualiza fecha', () => {
          beforeAll(done => {
            supertest(app)
              .patch(PATH(invoice._id))
              .send({
                date,
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
              .patch(PATH(invoice._id))
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

  describe('DELETE /client/invoices/:id', () => {
    const PATH = id => `/client/invoices/${id}`;
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

        beforeAll(() => ClientInvoiceModel.create(invoiceMock)
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        describe('No es la ultima factura', () => {
          beforeAll(() => AutoIncrement.create({
            name: 'clientInvoice2020',
            seq: 1,
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

        describe('Es la última factura', () => {
          beforeAll(() => AutoIncrement.create({
            name: 'clientInvoice2020',
            seq: 22,
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
          delete invoiceData.nInvoice;

          await ClientInvoiceModel.create(invoiceData)
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

  describe('POST /client/invoices/:id/deliveryOrder', () => {
    const PATH = id => `/client/invoices/${id}/deliveryOrder`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(PATH('5ef26172ccfd9d1541b870be'))
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

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH('5f761ae5a7d8986bc28ff7f4'))
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
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('Añade un albarán', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH(invoice._id))
            .send()
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 204', () => {
          expect(token)
            .toBeTruthy();
          expect(response.status)
            .toBe(204);
        });

        test('Se añade el albarán', async () => {
          const invoiceEdited = await ClientInvoiceModel.findOne({ _id: invoice._id });
          const { deliveryOrders } = invoiceEdited;
          expect(deliveryOrders[0].date).toBeNull();
          expect(deliveryOrders[0].total).toBe(0);
          expect(deliveryOrders[0].products.length).toBe(0);
        });
      });
    });
  });
});
