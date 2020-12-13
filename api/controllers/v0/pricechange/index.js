const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const PriceChangeController = require('./pricechange.controller');

module.exports = ({ priceService }) => {
  const priceChangeController = new PriceChangeController({
    errorHandler,
    priceService,
  });

  return [{
    method: 'get',
    domain: 'pricechanges',
    path: '/',
    handler: priceChangeController.priceChanges,
    bindTo: priceChangeController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
