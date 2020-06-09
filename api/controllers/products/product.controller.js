const Promise = require('bluebird');

const LogService = require('../../services/log.service');

const TYPE = 'ProductController';

const logService = new LogService(TYPE);

class ProductController {
  constructor({
    productService,
    errorHandler,
  }) {
    this.productService = productService;
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
   * Return all products with the filters
   */
  products(req, res) {
    logService.logInfo('[products] - List products');
    Promise.resolve(req.query)
      .then(this.productService.products)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Create the new product
   */
  create(req, res) {
    logService.logInfo('[products] - Create product');
    Promise.resolve(req.body)
      .then(this.productService.create)
      .then(() => res.status(201)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the product
   */
  edit(req, res) {
    logService.logInfo('[products] - Edit product');
    Promise.resolve(req)
      .then(this.productService.update)
      .then(() => res.status(204)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add new price to the product
   */
  updatePrice(req, res) {
    logService.logInfo('[products] - Add new price');
    Promise.resolve(req)
      .then(this.productService.updatePrice)
      .then(() => res.status(201)
        .send())
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = ProductController;
