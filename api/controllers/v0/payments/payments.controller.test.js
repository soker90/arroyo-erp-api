const supertest = require('supertest');
const { mongoose, PaymentModel } = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const { commonErrors } = require('../../../../errors');
const { TYPE_PAYMENT } = require('../../../../constants');

describe('PaymentsController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  const paymentMock = {
    provider: '5e430c9b7d2d2ded823b153b',
    nameProvider: 'Fulanito SL',
    invoices: [
      '5f18724d869c550017e9adf6',
      '5f1872ca869c550017e9adf8',
    ],
    nOrder: '3, 34',
    paymentDate: 1591213980000,
    amount: 23,
    type: 'Efectivo',
  };

  const payment2Mock = {
    provider: '5f187222869c550017e9adf5',
    nameProvider: 'Pollos JB',
    invoices: [
      '5f1871b3869c550017e9adf3',
    ],
    nOrder: '23',
    paymentDate: 1594919520000,
    merged: true,
    amount: 21,
    type: 'Talón',
    numCheque: '8766B',
    paid: true,
  };

  describe('GET /payments', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/payments')
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

      describe('Sin pagos pendientes', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/payments')
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

      describe('Tiene pagos pendientes', () => {
        let payment;

        before(() => PaymentModel.create(paymentMock)
          .then(paymentCreated => {
            payment = paymentCreated;
          }));

        describe('Devuelve los pagos', () => {
          let response;

          before(done => {
            supertest(app)
              .get('/payments')
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
              .toEqual(JSON.stringify(payment._id));
            expect(json.provider)
              .toBe(payment.provider);
            expect(json.nameProvider)
              .toBe(payment.nameProvider);
            expect(json.invoices.toString())
              .toEqual(payment.invoices.toString());
            expect(json.nOrder)
              .toBe(payment.nOrder);
            expect(json.paymentDate)
              .toBe(payment.paymentDate);
            expect(json.amount)
              .toBe(payment.amount);
            expect(json.type)
              .toBe(payment.type);
          });
        });
      });
    });
  });

  describe('PATCH /payments/:id/confirm', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch('/payments/5ef26172ccfd9d1541b870be/confirm')
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

      describe('El id del pago no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch('/payments/5ef26172ccfd9d1541b870be/confirm')
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

      describe('Sin fecha de pago', () => {
        let response;
        let payment;

        before(() => PaymentModel.create({})
          .then(paymentCreated => {
            payment = paymentCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/payments/${payment._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              type: 'Efectivo',
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
            .toBe(new commonErrors.DateNotValid().message);
        });
      });

      describe('Sin tipo de pago', () => {
        let response;
        let payment;

        before(() => PaymentModel.create({})
          .then(paymentCreated => {
            payment = paymentCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/payments/${payment._id}/confirm`)
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

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new commonErrors.MissingParamsError().message);
        });
      });

      describe('Tipo de pago talón sin numero de talón', () => {
        let response;
        let payment;

        before(() => PaymentModel.create({})
          .then(paymentCreated => {
            payment = paymentCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/payments/${payment._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              paymentDate: 1591213980000,
              type: TYPE_PAYMENT.CHEQUE,
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
            .toBe(new commonErrors.MissingParamsError().message);
        });
      });

      describe('Se envía datos correctos', () => {
        let response;
        let payment;

        before(() => PaymentModel.create({})
          .then(paymentCreated => {
            payment = paymentCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/payments/${payment._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              paymentDate: 1591213980000,
              type: TYPE_PAYMENT.TRANSFER,
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

        test('Debería devolver un array', () => {
          expect(Array.isArray(response.body))
            .toBe(true);
        });
      });

      describe('Pago correcto con talón', () => {
        let response;
        let payment;

        before(() => PaymentModel.create({})
          .then(paymentCreated => {
            payment = paymentCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(`/payments/${payment._id}/confirm`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              paymentDate: 1591213980000,
              type: TYPE_PAYMENT.CHEQUE,
              numCheque: '33H',
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

        test('Debería devolver un array', () => {
          expect(Array.isArray(response.body))
            .toBe(true);
        });
      });
    });
  });

  describe('POST /payments/merge', () => {
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post('/payments/merge')
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

      describe('No se envían pagos', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/payments/merge')
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
      });

      describe('Solo se envía un pago', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/payments/merge')
            .set('Authorization', `Bearer ${token}`)
            .send({ payments: ['5f286da0ccb888aa8986e0cb'] })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(response.status)
            .toBe(400);
        });
      });

      describe('Se envían pagos que no existen', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post('/payments/merge')
            .set('Authorization', `Bearer ${token}`)
            .send({ payments: ['5f286da0ccb888aa8986e0cb', '5f286ce7ccb888aa8986e0c6'] })
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

      describe('Se envía datos correctos', () => {
        let response;
        let payment;
        let payment2;

        before(() => Promise.all([
          PaymentModel.create(paymentMock)
            .then(paymentCreated => {
              payment = paymentCreated;
            }),
          PaymentModel.create(payment2Mock)
            .then(paymentCreated => {
              payment2 = paymentCreated;
            }),
        ]));

        beforeAll(done => {
          supertest(app)
            .post('/payments/merge')
            .set('Authorization', `Bearer ${token}`)
            .send({
              payments: [payment._id, payment2._id],
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

        test('Se recibe un array con un pago', () => {
          expect(response.body.length)
            .toBe(1);
        });

        test('', () => {
          const paymentReceived = response.body[0];
          expect(paymentReceived.amount)
            .toBe(paymentMock.amount + payment2Mock.amount);
          expect(paymentReceived.invoices.toString())
            .toBe(paymentMock.invoices.concat(payment2Mock.invoices)
              .toString());
          expect(paymentReceived.nOrder)
            .toBe('3, 34 23 ');
          expect(paymentReceived.paymentDate)
            .toBe(paymentMock.paymentDate);
          expect(paymentReceived.provider)
            .toBe(paymentMock.provider);
          expect(paymentReceived.type)
            .toBe(paymentMock.type);
        });
      });
    });
  });
});
