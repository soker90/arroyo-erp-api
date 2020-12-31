const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const ClientInvoiceController = require('./clientInvoices.controller');

module.exports = (
  {
    invoiceService,
    paymentService,
    billingService,
    deliveryOrderService,
    autoIncrementService,
    clientInvoiceService,
  },
  {
    invoiceValidator,
    providerValidator,
    clientValidator,
  },
  { invoiceAdapter },
) => {
  const clientInvoicesController = new ClientInvoiceController({
    invoiceService,
    paymentService,
    errorHandler,
    invoiceValidator,
    invoiceAdapter,
    billingService,
    providerValidator,
    deliveryOrderService,
    autoIncrementService,
    clientValidator,
    clientInvoiceService,
  });

  return [{
    method: 'post',
    domain: 'client/invoices',
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
    domain: 'client/invoices',
    path: '/',
    handler: clientInvoicesController.invoices,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'client/invoices',
    path: '/:id',
    handler: clientInvoicesController.edit,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'client/invoices',
    path: '/:id',
    handler: clientInvoicesController.delete,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'client/invoices',
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
    domain: 'client/invoices',
    path: '/:id',
    handler: clientInvoicesController.invoice,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'client/invoices',
    path: '/:id/confirm',
    handler: clientInvoicesController.invoiceConfirm,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'client/invoices',
    path: '/export/:year',
    handler: clientInvoicesController.export,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'client/invoices',
    path: '/export/:year/:month',
    handler: clientInvoicesController.export,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'client/invoices',
    path: '/swap/:a/:b',
    handler: clientInvoicesController.swap,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
