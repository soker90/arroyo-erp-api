const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'ClientController';

const logService = new LogService(TYPE);

class ClientsController {
  constructor({
    clientService,
    errorHandler,
    clientValidator,
    clientAdapter
  }) {
    this.clientService = clientService;
    this.errorHandler = errorHandler;
    this.clientValidator = clientValidator;
    this.clientAdapter = clientAdapter;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'ClientMissingName':
    case 'ParamNotValidError':
      this.errorHandler.sendBadRequest(res)(error);
      break;
    case 'ClientIdNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
      /* istanbul ignore next */
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
   * Return all provider with the filters
   */
  clients(req, res) {
    logService.logInfo('[clients] - Lista de clientes');
    Promise.resolve(req.query)
      .then(this.clientService.clients)
      .then(this.clientAdapter.clientsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Create the new provider
   */
  create(req, res) {
    logService.logInfo('[clients] - Crea un cliente');
    Promise.resolve(req.body)
      .tap(this.clientValidator.fieldsValid)
      .then(this.clientService.create)
      .then(() => res.status(201)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the provider
   */
  edit(req, res) {
    logService.logInfo('[clients] - Edita un cliente');
    Promise.resolve(req)
      .tap(this.clientValidator.validateIdParam)
      .tap(this.clientValidator.fieldsValidBody)
      .then(this.clientService.update)
      .then(() => res.status(204)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return all products with the filters
   */
  client(req, res) {
    logService.logInfo('[clients] - Devuelve los datos de un cliente');
    Promise.resolve(req.params)
      .tap(this.clientValidator.validateId)
      .then(this.clientService.client)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = ClientsController;
