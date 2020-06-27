const {
  AccountController,
  ProductController,
  ProviderController,
  DeliveryOrderController,
  InvoiceController,
} = require('./controllers');
const {
  accountService,
  productService,
  providerService,
  deliveryOrderService,
  invoiceService,
} = require('./services');
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

const deliveryOrderController = new DeliveryOrderController({
  errorHandler,
  deliveryOrderService,
});

const invoicesController = new InvoiceController({
  errorHandler,
  invoiceService,
});

module.exports = async app => {
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
  app.post(
    '/products',
    authMiddleware,
    productController.create.bind(productController)
  );
  app.patch(
    '/products/:id',
    authMiddleware,
    productController.edit.bind(productController)
  );
  app.post(
    '/products/:id/prices',
    authMiddleware,
    productController.updatePrice.bind(productController)
  );
  /**
   * Providers endpoints
   */
  app.get(
    '/providers',
    authMiddleware,
    providerController.providers.bind(providerController)
  );
  app.post(
    '/providers',
    authMiddleware,
    providerController.create.bind(providerController)
  );
  app.put(
    '/providers/:id',
    authMiddleware,
    providerController.edit.bind(providerController)
  );
  app.get(
    '/providers/:id',
    authMiddleware,
    providerController.provider.bind(providerController)
  );
  /**
   * Delivery orders endpoints
   */
  app.get(
    '/deliveryorders',
    authMiddleware,
    deliveryOrderController.orders.bind(deliveryOrderController)
  );
  app.post(
    '/deliveryorders',
    authMiddleware,
    deliveryOrderController.create.bind(deliveryOrderController)
  );
  app.patch(
    '/deliveryorders/:id',
    authMiddleware,
    deliveryOrderController.edit.bind(deliveryOrderController)
  );
  app.get(
    '/deliveryorders/:id',
    authMiddleware,
    deliveryOrderController.deliveryOrder.bind(deliveryOrderController)
  );
  /**
   *  Products of deliver order
   */
  app.post(
    '/deliveryorders/:id/product',
    authMiddleware,
    deliveryOrderController.addProduct.bind(deliveryOrderController)
  );
  app.put(
    '/deliveryorders/:id/product/:index',
    authMiddleware,
    deliveryOrderController.updateProduct.bind(deliveryOrderController)
  );
  app.delete(
    '/deliveryorders/:id/product/:index',
    authMiddleware,
    deliveryOrderController.deleteProduct.bind(deliveryOrderController)
  );
  /**
   * Invoices endpoints
   */
  app.post(
    '/invoices',
    authMiddleware,
    invoicesController.create.bind(invoicesController)
  );
  app.get(
    '/invoices',
    authMiddleware,
    invoicesController.invoices.bind(invoicesController)
  );
  app.get(
    '/invoices/provider/:idProvider',
    authMiddleware,
    invoicesController.invoicesByProvider.bind(invoicesController)
  );
  app.get('/invoices/:id', authMiddleware, invoicesController.invoice.bind(invoicesController));
};
