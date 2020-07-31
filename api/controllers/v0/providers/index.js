const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const ProviderController = require('./providers.controller');

module.exports = ({ providerService }) => {
  const providerController = new ProviderController({
    errorHandler,
    providerService,
  });

  return [{
    method: 'get',
    domain: 'providers',
    path: '/',
    handler: providerController.providers,
    bindTo: providerController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'providers',
    path: '/',
    handler: providerController.create,
    bindTo: providerController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'put',
    domain: 'providers',
    path: '/:id',
    handler: providerController.edit,
    bindTo: providerController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'providers',
    path: '/:id',
    handler: providerController.provider,
    bindTo: providerController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
