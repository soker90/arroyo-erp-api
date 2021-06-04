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
    date: 1589407320000,
    concept: 'This is the note',
    quantity: '33',
    price: '2€',
    amount: '22.3',
    clarification: 'una aclaracion',
    year: '2020',
  };

  const note2Mock = {
    date: 1591213980000,
    concept: 'Un mensaje de prueba para la nota',
    quantity: '31,3',
    price: '1,24€',
    amount: '1.23',
    clarification: 'Unas aclaraciones',
    year: '2020',
  };

  describe('GET /notes', () => {
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get('/notes?year=2010')
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
            .get('/notes?year=2020')
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
              .get('/notes?year=2020')
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
            expect(json.concept)
              .toBe(note.concept);
            expect(json.date)
              .toBe(note.date);
            expect(json.quantity)
              .toBe(note.quantity);
            expect(json.price)
              .toBe(note.price);
            expect(json.amount)
              .toBe(note.amount);
            expect(json.clarification)
              .toBe(note.clarification);
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
          expect(json.concept)
            .toBe(note.concept);
          expect(json.date)
            .toBe(note.date);
          expect(json.quantity)
            .toBe(note.quantity);
          expect(json.price)
            .toBe(note.price);
          expect(json.amount)
            .toBe(note.amount);
          expect(json.clarification)
            .toBe(note.clarification);
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
              concept: 'mensaje',
              year: '2020',
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
              concept: 'mensaje',
              year: '2020',
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
          const json = response.body[0];
          expect(json.date)
            .toBe(noteMock.date);
          expect(json.concept)
            .toBe(noteMock.concept);
          expect(json.quantity)
            .toBe(noteMock.quantity);
          expect(json.price)
            .toBe(noteMock.price);
          expect(json.amount)
            .toBe(noteMock.amount);
          expect(json.clarification)
            .toBe(noteMock.clarification);
        });
      });
    });
  });

  describe('PUT /notes/:id', () => {
    const PATH = id => `/notes/${id}`;

    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .put(PATH('5f567000685de0559bf930f8'))
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

        beforeAll(done => {
          supertest(app)
            .put(PATH('5f567000685de0559bf930f8'))
            .set('Authorization', `Bearer ${token}`)
            .send(note2Mock)
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
            .toBe(new noteErrors.NoteIdNotFound().message);
        });
      });

      describe('La nota existe', () => {
        let note;

        beforeAll(() => NoteModel.create(noteMock)
          .then(noteCreated => {
            note = noteCreated;
          }));

        describe('La fecha enviada es incorrecta', () => {
          let response;

          beforeAll(done => {
            supertest(app)
              .put(PATH(note._id))
              .set('Authorization', `Bearer ${token}`)
              .send({
                date: 'invalid',
                concept: 'messs',
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
              .put(PATH(note._id))
              .set('Authorization', `Bearer ${token}`)
              .send({
                concept: 'mensaje',
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
              .put(PATH(note._id))
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
              .put(PATH(note._id))
              .set('Authorization', `Bearer ${token}`)
              .send(note2Mock)
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
            const json = response.body[0];
            expect(json.concept)
              .toBe(note2Mock.concept);
            expect(json.date)
              .toBe(note2Mock.date);
            expect(json.quantity)
              .toBe(note2Mock.quantity);
            expect(json.price)
              .toBe(note2Mock.price);
            expect(json.amount)
              .toBe(note2Mock.amount);
            expect(json.clarification)
              .toBe(note2Mock.clarification);
          });
        });
      });
    });
  });

  describe('DELETE /notes/:id', () => {
    const PATH = id => `/notes/${id}`;

    before(() => testDB.clean());

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

      describe('No existe la nota', () => {
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
            .toBe(new noteErrors.NoteIdNotFound().message);
        });
      });

      describe('La nota existe', () => {
        let note;

        beforeAll(() => NoteModel.create(noteMock)
          .then(noteCreated => {
            note = noteCreated;
          }));

        describe('Se elimina la nota correctamente', () => {
          let response;

          beforeAll(done => {
            supertest(app)
              .delete(PATH(note._id))
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
            expect(response.body.length)
              .toBe(0);
          });
        });
      });
    });
  });
});
