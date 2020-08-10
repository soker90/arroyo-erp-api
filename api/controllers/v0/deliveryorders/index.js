const DeliveryOrderController = require('./deliveryorders.controller');

module.exports = DeliveryOrderController;

const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

module.exports = ({ deliveryOrderService }, { deliveryOrderValidator, productValidator }) => {
  const deliveryOrderController = new DeliveryOrderController({
    errorHandler,
    deliveryOrderService,
    deliveryOrderValidator,
    productValidator,
  });

  return [{
    method: 'get',
    domain: 'deliveryorders',
    path: '/',
    handler: deliveryOrderController.orders,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'deliveryorders',
    path: '/',
    handler: deliveryOrderController.create,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'deliveryorders',
    path: '/:id',
    handler: deliveryOrderController.edit,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'deliveryorders',
    path: '/:id',
    handler: deliveryOrderController.deliveryOrder,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'post',
    domain: 'deliveryorders',
    path: '/:id/product',
    handler: deliveryOrderController.addProduct,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'put',
    domain: 'deliveryorders',
    path: '/:id/product/:index',
    handler: deliveryOrderController.updateProduct,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'deliveryorders',
    path: '/:id/product/:index',
    handler: deliveryOrderController.deleteProduct,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
