const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const ClientInvoiceController = require('./clientInvoices.controller');

const DOMAIN = 'client/invoices';

module.exports = (
  {
    invoiceService,
    paymentService,
    autoIncrementService,
    clientInvoiceService,
    productService,
  },
  {
    invoiceValidator,
    clientValidator,
    clientInvoiceValidator,
  },
  {
    clientInvoiceAdapter,
  },
) => {
  const clientInvoicesController = new ClientInvoiceController({
    invoiceService,
    paymentService,
    errorHandler,
    invoiceValidator,
    autoIncrementService,
    clientValidator,
    clientInvoiceService,
    clientInvoiceValidator,
    clientInvoiceAdapter,
    productService,
  });

  return [{
    method: 'post',
    domain: DOMAIN,
    path: '/',
    handler: clientInvoicesController.create,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: DOMAIN,
    path: '/',
    handler: clientInvoicesController.invoices,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: DOMAIN,
    path: '/export',
    handler: clientInvoicesController.invoicesExport,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'patch',
    domain: DOMAIN,
    path: '/:id',
    handler: clientInvoicesController.edit,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: DOMAIN,
    path: '/:id',
    handler: clientInvoicesController.delete,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: DOMAIN,
    path: '/short',
    handler: clientInvoicesController.invoicesShort,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: DOMAIN,
    path: '/billing',
    handler: clientInvoicesController.billing,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'patch',
    domain: DOMAIN,
    path: '/payments/:id',
    handler: clientInvoicesController.applyPayment,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: DOMAIN,
    path: '/billing/export',
    handler: clientInvoicesController.billingExport,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: DOMAIN,
    path: '/:id',
    handler: clientInvoicesController.invoice,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: DOMAIN,
    path: '/:id/deliveryOrder',
    handler: clientInvoicesController.addDeliveryOrder,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: DOMAIN,
    path: '/:id/deliveryOrder/:deliveryOrder',
    handler: clientInvoicesController.editDeliveryOrder,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: DOMAIN,
    path: '/:id/deliveryOrder/:deliveryOrder',
    handler: clientInvoicesController.deleteDeliveryOrder,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: DOMAIN,
    path: '/:id/deliveryOrder/:deliveryOrder/product',
    handler: clientInvoicesController.addProduct,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: DOMAIN,
    path: '/:id/deliveryOrder/:deliveryOrder/product/:product',
    handler: clientInvoicesController.editProduct,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: DOMAIN,
    path: '/:id/deliveryOrder/:deliveryOrder/product/:product',
    handler: clientInvoicesController.deleteProduct,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: DOMAIN,
    path: '/:id/confirm',
    handler: clientInvoicesController.invoiceConfirm,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: DOMAIN,
    path: '/export/:id',
    handler: clientInvoicesController.export,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: DOMAIN,
    path: '/export/:year/:month',
    handler: clientInvoicesController.export,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
