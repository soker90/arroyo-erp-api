const Promise = require('bluebird');

const LogService = require('../../services/log.service');

const TYPE = 'DeliveryOrderController';

const logService = new LogService(TYPE);

class DeliveryOrdersController {
  constructor({
    deliveryOrderService,
    errorHandler,
  }) {
    this.deliveryOrderService = deliveryOrderService;
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
      .then(this.deliveryOrderService.create)
      .then(() => res.status(201)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the delivery order
   */
  edit(req, res) {
    logService.logInfo('[delivery orders]  - Edit delivery order');
    Promise.resolve(req)
      .then(this.deliveryOrderService.update)
      .then(() => res.status(204)
        .send())
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
}

module.exports = DeliveryOrdersController;
