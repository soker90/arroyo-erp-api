const { AccountController, ProductController, ProviderController } = require('./controllers');
const { accountService, productService, providerService } = require('./services');
const { authMiddleware } = require('../components/auth');

const errorHandler = require('../components/error-handlers');

const accountController = new AccountController({
  errorHandler,
  accountService,
});

const productController = new ProductController({
  errorHandler,
  productService,
});

const providerController = new ProviderController({
  errorHandler,
  providerService,
});

module.exports = async (app) => {
  app.get('/monit/health', (req, res) => res.send('OK'));
  /**
   * Account endpoints
   */
  app.post('/account/login', accountController.auth.bind(accountController));
  app.get('/account/me', authMiddleware, accountController.me.bind(accountController));
  app.post('/account/createAccount', authMiddleware, accountController.createAccount.bind(accountController));
  /**
   * Products endpoints
   */
  app.get('/products', authMiddleware, productController.products.bind(productController));
  app.post('/products', authMiddleware, productController.create.bind(productController));
  app.patch('/products/:id', authMiddleware, productController.edit.bind(productController));
  /**
   * Providers endpoints
   */
  app.get('/providers', authMiddleware, providerController.providers.bind(providerController));
  app.post('/providers', authMiddleware, providerController.create.bind(providerController));
  app.patch('/providers/:id', authMiddleware, providerController.edit.bind(providerController));
  app.get('/providers/:id', authMiddleware, providerController.provider.bind(providerController));
};
