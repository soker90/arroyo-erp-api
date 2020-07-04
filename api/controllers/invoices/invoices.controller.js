const Promise = require('bluebird');

const LogService = require('../../services/log.service');

const TYPE = 'InvoiceController';

const logService = new LogService(TYPE);

class InvoicesController {
  constructor({ invoiceService, errorHandler }) {
    this.invoiceService = invoiceService;
    this.errorHandler = errorHandler;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'InvoiceInvalidDateInvoice':
    case 'InvoiceMissingDeliveryOrders':
    case 'InvoiceNotFoundDeliveryOrder':
      this.errorHandler.sendValidationError(res)(error);
      break;
    case 'InvoiceIdNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
    case 'InvoiceMissingId':
      this.errorHandler.sendBadRequest(res)(error);
      break;
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
   * Return invoice
   */
  invoice(req, res) {
    logService.logInfo('[inovice]  - Get invoice');
    Promise.resolve(req.params)
      .then(this.invoiceService.invoice)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return all invoices
   */
  invoices(req, res) {
    logService.logInfo('[invoices] - List of invoices');
    Promise.resolve(req.query)
      .then(this.invoiceService.invoices)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  invoicesByProvider(req, res) {
    logService.logInfo(
      '[invoicesByProvider] - List of invoices of the provider'
    );
    Promise.resolve(req)
      .then(this.invoiceService.invoicesByProvider)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

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

  /**
   * Return invoice
   */
  invoiceConfirm(req, res) {
    logService.logInfo('[inovice]  - Confirm invoice');
    Promise.resolve(req.params)
      .then(this.invoiceService.invoiceConfirm)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = InvoicesController;
