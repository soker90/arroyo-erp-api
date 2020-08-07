const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'PaymentController';

const logService = new LogService(TYPE);

class PaymentsController {
  constructor({
    paymentService, errorHandler, paymentValidator,
  }) {
    this.errorHandler = errorHandler;
    this.paymentService = paymentService;
    this.paymentValidator = paymentValidator;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'PaymentIdNotFound':
    case 'PaymentDivideNotMerged':
      this.errorHandler.sendNotFound(res)(error);
      break;
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

  confirm(req, res) {
    logService.logInfo('[payment]  - Confirma la realización del pago');
    Promise.resolve(req)
      .tap(this.paymentValidator.validateId)
      .tap(this.paymentValidator.confirmParams)
      .then(this.paymentService.confirm)
      .then(this.paymentService.payments)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  merge(req, res) {
    logService.logInfo('[payment]  - Fusiona varios pagos');
    Promise.resolve(req.body)
      .tap(this.paymentValidator.havePayments)
      .then(this.paymentService.merge)
      .then(this.paymentService.payments)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  divide(req, res) {
    logService.logInfo('[payment] - Divide un pago fusionado');
    Promise.resolve(req.params)
      .tap(this.paymentValidator.validateId)
      .tap(this.paymentValidator.isMerged)
      .tap(this.paymentService.divide)
      .then(this.paymentService.payments)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = PaymentsController;
