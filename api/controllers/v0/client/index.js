const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const ClientController = require('./client.controller');

module.exports = ({ clientService }, { clientValidator }, { clientAdapter }) => {
  const clientController = new ClientController({
    errorHandler,
    clientService,
    clientValidator,
    clientAdapter,
  });

  return [{
    method: 'get',
    domain: 'clients',
    path: '/',
    handler: clientController.clients,
    bindTo: clientController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'clients',
    path: '/',
    handler: clientController.create,
    bindTo: clientController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'put',
    domain: 'clients',
    path: '/:id',
    handler: clientController.edit,
    bindTo: clientController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'clients',
    path: '/:id',
    handler: clientController.client,
    bindTo: clientController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
