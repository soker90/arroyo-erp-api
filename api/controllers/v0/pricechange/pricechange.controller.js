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
   * Return all prices changes
   */
  priceChanges(req, res) {
    logService.logInfo('[cambios de precio] - Lista con las notifiaciones de cambios de precio');
    Promise.resolve(req)
      .then(this.priceService.priceChanges)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Change to read/unread
   */
  changeRead(req, res) {
    logService.logInfo('[cambios de precio] - Cambia a leido/no leido');
    Promise.resolve(req)
      .then(this.priceService.priceChangeRead)
      .then(this.priceService.priceChanges)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Change to read/unread
   */
  unreadCount(req, res) {
    logService.logInfo('[cambios de precio] - Notificaciones no leídas');
    Promise.resolve(req)
      .then(this.priceService.priceChangesUnreadCount)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Change to read/unread
   */
  delete(req, res) {
    logService.logInfo('[cambios de precio] - Eliminando cambio de precio');
    Promise.resolve(req.params)
      .then(this.priceService.priceChangeDelete)
      .then(this.priceService.priceChanges)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = PriceChangeController;
