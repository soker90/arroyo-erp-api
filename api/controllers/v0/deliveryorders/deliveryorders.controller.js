const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'DeliveryOrderController';

const logService = new LogService(TYPE);

// TODO: Refactorizar toda la parte de albaranes
class DeliveryOrdersController {
  constructor({
    deliveryOrderService,
    errorHandler,
    deliveryOrderValidator,
    productValidator,
  }) {
    this.deliveryOrderService = deliveryOrderService;
    this.errorHandler = errorHandler;
    this.deliveryOrderValidator = deliveryOrderValidator;
    this.productValidator = productValidator;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'DeliveryOrderMissing':
      this.errorHandler.sendBadRequest(res)(error);
      break;
    case 'DeliveryOrderProviderNotFound':
    case 'DeliveryOrderNotFound':
    case 'ProductNotFound':
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
      .then(this.deliveryOrderService.orders)
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
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the delivery order
   */
  edit(req, res) {
    logService.logInfo('[delivery orders]  - Edit delivery order');
    Promise.resolve(req)
      .then(this.deliveryOrderService.update)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return all products with the filters
   */
  deliveryOrder(req, res) {
    logService.logInfo('[delivery orders]  - Get delivery order');
    Promise.resolve(req.params)
      .then(this.deliveryOrderService.deliveryOrder)
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
      .tap(this.productValidator.validateProductBody)
      .then(this.deliveryOrderService.addProduct)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add product to delivery order
   */
  updateProduct(req, res) {
    logService.logInfo('[delivery orders] - Update product of a delivery order');
    Promise.resolve(req)
      .then(this.deliveryOrderService.updateProduct)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add product to delivery order
   */
  deleteProduct(req, res) {
    logService.logInfo('[delivery orders] - Delete product of the delivery order');
    Promise.resolve(req.params)
      .then(this.deliveryOrderService.deleteProduct)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = DeliveryOrdersController;
