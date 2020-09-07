const supertest = require('supertest');
const { mongoose, NoteModel } = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const { commonErrors, noteErrors } = require('../../../../errors');

describe('NoteController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  const noteMock = {
    date: 1591213980000,
    message: 'Esto es un mensaje',
  };

  describe('GET /notes', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/notes')
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

      describe('Sin notas', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/notes')
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
          expect(response.body)
            .toEqual([]);
        });
      });

      describe('Tiene notas', () => {
        let note;

        before(() => NoteModel.create(noteMock)
          .then(noteCreated => {
            note = noteCreated;
          }));

        describe('Devuelve las notas', () => {
          let response;

          before(done => {
            supertest(app)
              .get('/notes')
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
            expect(JSON.stringify(json._id))
              .toEqual(JSON.stringify(note._id));
            expect(json.message)
              .toBe(note.message);
            expect(json.date)
              .toBe(note.date);
          });
        });
      });
    });
  });

  describe('GET /notes/:id', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/notes/5f567000685de0559bf930f8')
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

      describe('No existe la nota', () => {
        let response;

        before(done => {
          supertest(app)
            .get('/notes/5f567000685de0559bf930f8')
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
            .toEqual(new noteErrors.NoteIdNotFound().message);
        });
      });

      describe('La nota existe', () => {
        let note;
        let response;

        before(() => NoteModel.create(noteMock)
          .then(noteCreated => {
            note = noteCreated;
          }));

        before(done => {
          supertest(app)
            .get(`/notes/${note._id}`)
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
          const json = response.body;
          expect(JSON.stringify(json._id))
            .toEqual(JSON.stringify(note._id));
          expect(json.message)
            .toBe(note.message);
          expect(json.date)
            .toBe(note.date);
        });
      });
    });
  });

  describe('POST /notes', () => {
    const PATH = '/notes';

    before(() => testDB.clean());

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

      describe('La fecha enviada es incorrecta', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({
              date: 'incorrecto',
              message: 'mensaje',
            })
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
            .toBe(new commonErrors.DateNotValid().message);
        });
      });

      describe('No se envía fecha', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({
              message: 'mensaje',
            })
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
            .toBe(new commonErrors.DateNotValid().message);
        });
      });

      describe('No se envía mensaje', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({
              date: 1591213980000,
            })
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
            .toBe(new commonErrors.MissingParamsError().message);
        });
      });

      describe('Se crea la nota correctamente', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .set('Authorization', `Bearer ${token}`)
            .send(noteMock)
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
          expect(response.body[0].date)
            .toBe(noteMock.date);
          expect(response.body[0].message)
            .toBe(noteMock.message);
        });
      });
    });
  });
});
