const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'BillingController';

const logService = new LogService(TYPE);

class BillingsController {
  constructor({
    billingService,
    errorHandler,
    billingValidator,
    billingAdapter,
  }) {
    this.billingService = billingService;
    this.errorHandler = errorHandler;
    this.billingValidator = billingValidator;
    this.billingAdapter = billingAdapter;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'BillingYearMissing':
      this.errorHandler.sendBadRequest(res)(error);
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
  billings(req, res) {
    logService.logInfo('[facturación] - Lista con la facturación de los proveedores');
    Promise.resolve(req.query)
      .tap(this.billingValidator.validateYear)
      .then(this.billingService.billings)
      .then(this.billingAdapter.billingsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return all provider with the filters
   */
  export(req, res) {
    logService.logInfo('[facturación] - Exportar la facturación de los proveedores');
    Promise.resolve(req.query)
      .tap(this.billingValidator.validateYear)
      .then(this.billingService.exportOds)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Recalculate billing totals for a given year
   */
  recalc(req, res) {
    logService.logInfo('[facturación] - Recalcular la facturación de los proveedores');
    Promise.resolve(req.query)
      .tap(this.billingValidator.validateYear)
      .then(this.billingService.recalc)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = BillingsController;
