const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const PaymentController = require('./payments.controller');

module.exports = ({ paymentService }, {
  paymentValidator,
  productValidator,
}) => {
  const paymentsController = new PaymentController({
    paymentService,
    errorHandler,
    paymentValidator,
    productValidator,
  });

  return [{
    method: 'get',
    domain: 'payments',
    path: '/',
    handler: paymentsController.payments,
    bindTo: paymentsController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'patch',
    domain: 'payments',
    path: '/:id/confirm',
    handler: paymentsController.confirm,
    bindTo: paymentsController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'post',
    domain: 'payments',
    path: '/merge',
    handler: paymentsController.merge,
    bindTo: paymentsController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'put',
    domain: 'payments',
    path: '/divide/:id',
    handler: paymentsController.divide,
    bindTo: paymentsController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'payments',
    path: '/export',
    handler: paymentsController.export,
    bindTo: paymentsController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  ];
};
