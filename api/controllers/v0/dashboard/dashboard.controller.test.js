const supertest = require('supertest');
const {
  mongoose,
  NoteModel,
  ReminderModel,
} = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const {
  reminderErrors,
} = require('../../../../errors');

const _checkData = (response, reminder) => {
  const json = response.body.reminders[0];
  expect(json.message)
    .toBe(reminder.message);
};

describe('DashboardController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('GET /dashboard', () => {
    const PATH = '/dashboard';

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

      describe('Sin recordatorios', () => {
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
          expect(response.body.reminders)
            .toEqual([]);
        });
      });

      describe('Tiene recordatorios', () => {
        let reminder;
        const message = 'Esto es un recordatorio';
        let response;

        before(() => ReminderModel.create({ message })
          .then(reminderCreated => {
            reminder = reminderCreated;
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
          expect(response.body.reminders.length)
            .toBe(1);
        });

        test('Los datos son correctos', () => {
          expect(response.body.reminders[0]._id)
            .toEqual(reminder._id.toString());
          _checkData(response, reminder);
        });
      });
    });
  });

  describe('POST /dashboard/createReminder', () => {
    const PATH = '/dashboard/createReminder';
    const message = 'Esto es un recordatorio de prueba';

    before(() => testDB.cleanAll());

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

      describe('Se crea un recordatorio', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({ message })
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('La nota se ha guardado', () => {
          _checkData(response, { message });
        });
      });
    });
  });

  describe('DELETE /dashboard/deleteReminder/:id', () => {
    const PATH = id => `/dashboard/deleteReminder/${id}`;

    before(() => testDB.cleanAll());

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

      describe('No existe el recordatorio', () => {
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
            .toBe(new reminderErrors.ReminderIdNotFound().message);
        });
      });

      describe('El recordatorio se elimina correctamente', () => {
        let reminder;
        const message = 'Este es un mensaje de prueba';
        let response;

        beforeAll(() => ReminderModel.create({ message })
          .then(reminderCreated => {
            reminder = reminderCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .delete(PATH(reminder._id))
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

        test('La nota se ha guardado', () => {
          expect(response.body.reminders.length)
            .toBe(0);
        });
      });
    });
  });
});
