const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'PriceChangeController';

const logService = new LogService(TYPE);

class PriceChangeController {
  constructor({
    priceService,
    errorHandler,
    priceChangeValidator,
  }) {
    this.priceService = priceService;
    this.errorHandler = errorHandler;
    this.priceChangeValidator = priceChangeValidator;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'ElementsNotFound':
    case 'PriceChangeNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
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
      .tap(this.priceChangeValidator.validateIdParam)
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
      .tap(this.priceChangeValidator.validateId)
      .then(this.priceService.priceChangeDelete)
      .then(this.priceService.priceChanges)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Changes prices to telegram
   */
  send(req, res) {
    logService.logInfo('[send] - Enviar a telegram');
    Promise.resolve(req.body)
      .tap(this.priceChangeValidator.validateIds)
      .then(this.priceService.sendToTelegram)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Change to read/unread
   */
  deleteManyChanges(req, res) {
    logService.logInfo('[deleteManyChanges] - Elimina varios cambios de precio');
    Promise.resolve(req.body)
      .tap(this.priceChangeValidator.validateIds)
      .then(this.priceService.deleteManyPricesChange)
      .then(this.priceService.priceChanges)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = PriceChangeController;
