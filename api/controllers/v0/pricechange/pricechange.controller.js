const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'PriceChangeController';

const logService = new LogService(TYPE);

class PriceChangeController {
  constructor({
    priceService,
    errorHandler,
  }) {
    this.priceService = priceService;
    this.errorHandler = errorHandler;
  }

  _handleError(res, error) {
    switch (error.name) {
    /* istanbul ignore next */
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
   * Return all provider with the filters
   */
  priceChanges(req, res) {
    logService.logInfo('[cambios de precio] - Lista con las notifiaciones de cambios de precio');
    Promise.resolve(req)
      .then(this.priceService.priceChanges)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = PriceChangeController;
