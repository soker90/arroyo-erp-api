const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'ProviderController';

const logService = new LogService(TYPE);

class ProvidersController {
  constructor({
    providerService,
    errorHandler,
    providerValidator,
  }) {
    this.providerService = providerService;
    this.errorHandler = errorHandler;
    this.providerValidator = providerValidator;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'ProviderMissingName':
      this.errorHandler.sendBadRequest(res)(error);
      break;
    case 'ProviderIdNotFound':
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
  providers(req, res) {
    logService.logInfo('[providers] - List of providers');
    Promise.resolve(req.query)
      .then(this.providerService.providers)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Create the new provider
   */
  create(req, res) {
    logService.logInfo('[providers] - Create provider');
    Promise.resolve(req.body)
      .then(this.providerService.create)
      .then(() => res.status(201)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the provider
   */
  edit(req, res) {
    logService.logInfo('[providers] - Edit provider');
    Promise.resolve(req)
      .tap(this.providerValidator.validateIdParam)
      .then(this.providerService.update)
      .then(() => res.status(204)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return all products with the filters
   */
  provider(req, res) {
    logService.logInfo('[providers] - List of providers');
    Promise.resolve(req.params)
      .tap(this.providerValidator.validateId)
      .then(this.providerService.provider)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = ProvidersController;
