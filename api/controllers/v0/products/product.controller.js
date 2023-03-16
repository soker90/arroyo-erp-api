const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'ProductController';

const logService = new LogService(TYPE);

class ProductController {
  constructor({
    productService,
    priceService,
    errorHandler,
    providerValidator,
    productValidator,
  }) {
    this.productService = productService;
    this.errorHandler = errorHandler;
    this.providerValidator = providerValidator;
    this.productValidator = productValidator;
    this.priceService = priceService;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'ProductMissingParams':
    case 'ProductMissingUpdate':
      this.errorHandler.sendBadRequest(res)(error);
      break;
    case 'ProductNotFound':
    case 'ProviderNotFound':
    case 'ProviderIdNotFound':
    case 'PriceNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
    case 'ProductCodeExists':
      this.errorHandler.sendConflict(res)(error);
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
      .tap(this.productValidator.validateCodeDuplicate)
      .then(this.productService.create)
      .then(() => res.status(201)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Create the new product
   */
  createForClients(req, res) {
    logService.logInfo('[products] - Crea un producto para clientes');
    Promise.resolve(req.body)
      .tap(this.productValidator.validateFieldsCreateByClients)
      .then(this.productService.createForClients)
      .then(this.productService.products)
      .then(data => res.send(data))
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
      .tap(this.productValidator.validateCodeDuplicateEdit)
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

  delete(req, res) {
    logService.logInfo('[products] - Delete product');
    Promise.resolve(req.params)
      .tap(this.productValidator.validateId)
      .then(this.productService.delete)
      .then(this.productService.products)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  getLastDeliveryOrder(req, res) {
    logService.logInfo('[getLastDeliveryOrder] - Get last delivery order');
    Promise.resolve(req.params)
      .tap(this.productValidator.validateId)
      .then(this.productService.getLastDeliveryOrder)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  export(req, res) {
    logService.logInfo('[export] - Exportar el listado de productos y sus precios de un proveedor');
    Promise.resolve(req.params)
      .tap(this.providerValidator.validateId)
      .then(this.productService.exportOds)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  wrongPrice(req, res) {
    logService.logInfo('[wrongPrice] - Get wrong prices');
    Promise.resolve()
      .then(this.productService.wrongPrices)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  deletePrice(req, res) {
    logService.logInfo('[deletePrice] - Delete price');
    Promise.resolve(req.params)
      .tap(this.productValidator.validatePrice)
      .then(this.priceService.deletePriceById)
      .then(() => res.status(204).send())
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = ProductController;
