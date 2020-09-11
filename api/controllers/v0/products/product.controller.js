const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'ProductController';

const logService = new LogService(TYPE);

class ProductController {
  constructor({
    productService,
    errorHandler,
    providerValidator,
    productValidator,
  }) {
    this.productService = productService;
    this.errorHandler = errorHandler;
    this.providerValidator = providerValidator;
    this.productValidator = productValidator;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'ProductMissingParams':
    case 'ProductMissingUpdate':
      this.errorHandler.sendBadRequest(res)(error);
      break;
    case 'ProductNotFound':
    case 'ProviderNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
      /* istanbul ignore next */
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
      .tap(this.providerValidator.validateProviderIfExist)
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
      .tap(this.providerValidator.validateProvider)
      .tap(this.productValidator.validateFields)
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
      .tap(this.productValidator.validateIdParam)
      .tap(this.productValidator.validateFieldsBody)
      .then(this.productService.update)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  product(req, res) {
    logService.logInfo('[products] - Get product');
    Promise.resolve(req.params)
      .tap(this.productValidator.validateId)
      .then(this.productService.product)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add new price to the product
   */
  updatePrice(req, res) {
    logService.logInfo('[products] - Add new price');
    Promise.resolve(req)
      .tap(this.productValidator.validateIdParam)
      .tap(this.productValidator.updatePriceBody)
      .then(this.productService.updatePrice)
      .then(() => res.status(201)
        .send())
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = ProductController;
