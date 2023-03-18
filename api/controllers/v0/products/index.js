const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const ProductController = require('./product.controller');

module.exports = (
  { productService, priceService, productPvpService },
  {
    providerValidator,
    productValidator,
  },
) => {
  const productController = new ProductController({
    errorHandler,
    productService,
    priceService,
    productPvpService,
    providerValidator,
    productValidator,
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
    path: '/wrong',
    handler: productController.wrongPrice,
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
    domain: 'products/clients',
    path: '/',
    handler: productController.createForClients,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'products',
    path: '/:id',
    handler: productController.delete,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'products',
    path: '/last-delivery-order/:id',
    handler: productController.getLastDeliveryOrder,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'products',
    path: '/export-provider/:id',
    handler: productController.export,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'delete',
    domain: 'products',
    path: '/:id/prices/:priceId',
    handler: productController.deletePrice,
    bindTo: productController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
