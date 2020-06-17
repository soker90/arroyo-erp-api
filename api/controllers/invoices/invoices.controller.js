const Promise = require('bluebird');

const LogService = require('../../services/log.service');

const TYPE = 'InvoiceController';

const logService = new LogService(TYPE);

class InvoicesController {
  constructor({
    invoiceService,
    errorHandler,
  }) {
    this.invoiceService = invoiceService;
    this.errorHandler = errorHandler;
  }

  _handleError(res, error) {
    switch (error.code) {
    case 400:
      this.errorHandler.sendBadRequest(res)(error);
      break;
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
   * Return all invoices with the filters
   */
  /* invoices(req, res) {
    logService.logInfo('[invoices] - List of invoices');
    Promise.resolve(req.query)
      .then(this.invoiceService.orders)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  } */

  /**
   * Create the new delivery order
   */
  create(req, res) {
    logService.logInfo('[invoices] - Create invoice');
    Promise.resolve(req.body)
      .then(this.invoiceService.create)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the delivery order
   */
  /* edit(req, res) {
    logService.logInfo('[delivery orders]  - Edit delivery order');
    Promise.resolve(req)
      .then(this.deliveryOrderService.update)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  } */

  /**
   * Return all products with the filters
   */
  /* deliveryOrder(req, res) {
    logService.logInfo('[delivery orders]  - Get delivery order');
    Promise.resolve(req.params)
      .then(this.deliveryOrderService.deliveryOrder)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  } */

  /**
   * Add product to delivery order
   */
  /* addProduct(req, res) {
    logService.logInfo('[delivery orders] - Add product to a delivery order');
    Promise.resolve(req)
      .then(this.deliveryOrderService.addProduct)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  } */

  /**
   * Add product to delivery order
   */
  /* updateProduct(req, res) {
    logService.logInfo('[delivery orders] - Update product of a delivery order');
    Promise.resolve(req)
      .then(this.deliveryOrderService.updateProduct)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  } */

  /**
   * Add product to delivery order
   */
  /* deleteProduct(req, res) {
    logService.logInfo('[delivery orders] - Delete product of the delivery order');
    Promise.resolve(req.params)
      .then(this.deliveryOrderService.deleteProduct)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  } */
}

module.exports = InvoicesController;
