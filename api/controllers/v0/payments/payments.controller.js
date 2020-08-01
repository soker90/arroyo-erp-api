const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'PaymentController';

const logService = new LogService(TYPE);

class PaymentsController {
  constructor({
    paymentService, errorHandler,
  }) {
    this.errorHandler = errorHandler;
    this.paymentService = paymentService;
  }

  _handleError(res, error) {
    switch (error.name) {
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
   * Return invoice
   */
  payments(req, res) {
    logService.logInfo('[payment]  - Lista de pagos no pagados');
    Promise.resolve(req.query)
      .then(this.paymentService.payments)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = PaymentsController;
