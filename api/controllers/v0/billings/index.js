const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const BillingController = require('./billings.controller');

module.exports = ({ billingService }, { billingValidator }, { billingAdapter }) => {
  const billingController = new BillingController({
    errorHandler,
    billingService,
    billingValidator,
    billingAdapter,
  });

  return [{
    method: 'get',
    domain: 'billings',
    path: '/',
    handler: billingController.billings,
    bindTo: billingController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'billings',
    path: '/export',
    handler: billingController.export,
    bindTo: billingController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
