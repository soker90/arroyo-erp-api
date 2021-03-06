const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'DeliveryOrderController';

const logService = new LogService(TYPE);

class DeliveryOrdersController {
  constructor({
    deliveryOrderService,
    errorHandler,
    deliveryOrderValidator,
    productValidator,
    providerValidator,
    deliveryOrderAdapter,
    invoiceService,
    priceService,
    clientValidator,
  }) {
    this.deliveryOrderService = deliveryOrderService;
    this.errorHandler = errorHandler;
    this.deliveryOrderValidator = deliveryOrderValidator;
    this.productValidator = productValidator;
    this.providerValidator = providerValidator;
    this.deliveryOrderAdapter = deliveryOrderAdapter;
    this.invoiceService = invoiceService;
    this.clientValidator = clientValidator;
    this.priceService = priceService;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'DeliveryOrderMissing':
    case 'DeliveryOrderDateRequired':
    case 'DeliveryOrderDeleteWithInvoice':
    case 'ParamNotValidError':
      this.errorHandler.sendBadRequest(res)(error);
      break;
    case 'DeliveryOrderProviderNotFound':
    case 'DeliveryOrderNotFound':
    case 'ProductNotFound':
    case 'DeliveryOrderProductIndexNotFound':
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
  orders(req, res) {
    logService.logInfo('[delivery orders] - List of delivery orders');
    Promise.resolve(req.query)
      .tap(this.providerValidator.validateProvider)
      .then(this.deliveryOrderService.orders)
      .then(this.deliveryOrderAdapter.ordersResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Create the new delivery order
   */
  create(req, res) {
    logService.logInfo('[delivery orders] - Create delivery order');
    Promise.resolve(req.body)
      .tap(this.deliveryOrderValidator.validateProvider)
      .then(this.deliveryOrderService.create)
      .then(this.deliveryOrderAdapter.standardResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the delivery order
   */
  edit(req, res) {
    logService.logInfo('[delivery orders]  - Edit delivery order');
    Promise.resolve(req)
      .tap(this.deliveryOrderValidator.validateIdParam)
      .then(this.deliveryOrderService.update)
      .then(this.deliveryOrderAdapter.basicResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Delete the delivery order
   */
  delete(req, res) {
    logService.logInfo('[Albaranes]  - Elimina un albarán');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.validateId)
      .tap(this.deliveryOrderValidator.isRemovable)
      .then(this.deliveryOrderService.delete)
      .then(() => res.status(204).send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return all products with the filters
   */
  deliveryOrder(req, res) {
    logService.logInfo('[delivery orders]  - Get delivery order');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.validateId)
      .then(this.deliveryOrderService.deliveryOrder)
      .then(this.deliveryOrderAdapter.standardResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add product to delivery order
   */
  addProduct(req, res) {
    logService.logInfo('[delivery orders] - Add product to a delivery order');
    Promise.resolve(req)
      .tap(this.deliveryOrderValidator.validateIdParam)
      .tap(this.deliveryOrderValidator.hasDate)
      .tap(this.deliveryOrderValidator.validateProductParams)
      .tap(this.productValidator.validateProductBody)
      .then(this.deliveryOrderService.addProduct)
      .then(this.priceService.updatePrice)
      .tap(this.invoiceService.refresh)
      .then(this.deliveryOrderAdapter.productsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add product to delivery order
   */
  updateProduct(req, res) {
    logService.logInfo('[delivery orders] - Update product of a delivery order');
    Promise.resolve(req)
      .tap(this.deliveryOrderValidator.validateIdParam)
      .tap(this.deliveryOrderValidator.validateProductIndexParams)
      .tap(this.deliveryOrderValidator.validateProductParams)
      .tap(this.productValidator.validateProductBody)
      .then(this.deliveryOrderService.updateProduct)
      .then(this.priceService.updatePrice)
      .tap(this.invoiceService.refresh)
      .then(this.deliveryOrderAdapter.productsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add product to delivery order
   */
  deleteProduct(req, res) {
    logService.logInfo('[delivery orders] - Delete product of the delivery order');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.validateId)
      .tap(this.deliveryOrderValidator.validateProductIndex)
      .tap(this.priceService.deletePrice)
      .then(this.deliveryOrderService.deleteProduct)
      .tap(this.invoiceService.refresh)
      .then(this.deliveryOrderAdapter.productsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Count delivery orders free by provider
   */
  countFree(req, res) {
    logService.logInfo('[countFree] - Count delivery orders free by provider');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.isValidYear)
      .then(this.deliveryOrderService.countFree)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = DeliveryOrdersController;
