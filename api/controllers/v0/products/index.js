const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const ProductController = require('./product.controller');

module.exports = ({ productService }) => {
  const productController = new ProductController({
    errorHandler,
    productService,
  });

  return [{
    method: 'get',
    domain: 'products',
    path: '/',
    handler: productController.products,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'products',
    path: '/',
    handler: productController.create,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'put',
    domain: 'products',
    path: '/:id',
    handler: productController.edit,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'products',
    path: '/:id',
    handler: productController.product,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'products',
    path: '/:id/prices',
    handler: productController.updatePrice,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};