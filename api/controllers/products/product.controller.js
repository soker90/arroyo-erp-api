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
    case 401:
      this.errorHandler.sendUnauthorizedError(res)(error);
      break;
    case 406:
      this.errorHandler.sendNotAcceptable(res)(error);
      break;
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }
}

module.exports = ProductController;
