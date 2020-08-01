const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const PaymentController = require('./payments.controller');

module.exports = ({ paymentService }) => {
  const paymentsController = new PaymentController({
    paymentService,
    errorHandler,
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
  ];
};
