const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const PriceChangeController = require('./pricechange.controller');

module.exports = ({ priceService }, { priceChangeValidator }) => {
  const priceChangeController = new PriceChangeController({
    errorHandler,
    priceService,
    priceChangeValidator,
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
  }, {
    method: 'patch',
    domain: 'pricechanges',
    path: '/:id',
    handler: priceChangeController.changeRead,
    bindTo: priceChangeController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'pricechanges',
    path: '/unread/count',
    handler: priceChangeController.unreadCount,
    bindTo: priceChangeController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'delete',
    domain: 'pricechanges',
    path: '/:id',
    handler: priceChangeController.delete,
    bindTo: priceChangeController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'pricechanges',
    path: '/deletemany',
    handler: priceChangeController.deleteManyChanges,
    bindTo: priceChangeController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
