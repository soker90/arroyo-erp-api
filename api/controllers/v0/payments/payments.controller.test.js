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
});
