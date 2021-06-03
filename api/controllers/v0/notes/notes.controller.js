const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'NotesController';

const logService = new LogService(TYPE);

class NotesController {
  constructor({
    noteService, errorHandler, noteValidator,
  }) {
    this.errorHandler = errorHandler;
    this.noteService = noteService;
    this.noteValidator = noteValidator;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'NoteIdNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
    case 'MissingParamsError':
    case 'DateNotValid':
      this.errorHandler.sendBadRequest(res)(error);
      break;
      /* istanbul ignore next */
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
   * Return invoice
   */
  notes(req, res) {
    logService.logInfo('[notes]  - Lista de notas');
    Promise.resolve(req.query)
      .then(this.noteService.notes)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return invoice
   */
  note(req, res) {
    logService.logInfo('[note]  - Devuelve una nota');
    Promise.resolve(req.params)
      .tap(this.noteValidator.validateId)
      .then(this.noteService.note)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  create(req, res) {
    logService.logInfo('[create]  - Crea una nota');
    Promise.resolve(req.body)
      .tap(this.noteValidator.validateYear)
      .tap(this.noteValidator.validateNote)
      .then(this.noteService.create)
      .then(this.noteService.notes)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  edit(req, res) {
    logService.logInfo('[edit]  - Edita una nota');
    Promise.resolve(req)
      .tap(this.noteValidator.validateIdParam)
      .tap(this.noteValidator.validateNoteBody)
      .then(this.noteService.edit)
      .then(this.noteService.notes)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  delete(req, res) {
    logService.logInfo('[delete] - Elimina una nota');
    Promise.resolve(req.params)
      .tap(this.noteValidator.validateId)
      .then(this.noteService.deleteNote)
      .then(this.noteService.notes)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = NotesController;
