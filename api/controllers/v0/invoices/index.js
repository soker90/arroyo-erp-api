const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const InvoiceController = require('./invoices.controller');

module.exports = (
  { invoiceService, paymentService, billingService },
  { invoiceValidator },
  { invoiceAdapter },
) => {
  const invoicesController = new InvoiceController({
    invoiceService,
    paymentService,
    errorHandler,
    invoiceValidator,
    invoiceAdapter,
    billingService,
  });

  return [{
    method: 'post',
    domain: 'invoices',
    path: '/',
    handler: invoicesController.create,
    bindTo: invoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'post',
    domain: 'invoices/expense',
    path: '/',
    handler: invoicesController.expenseCreate,
    bindTo: invoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'invoices',
    path: '/',
    handler: invoicesController.invoices,
    bindTo: invoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'invoices',
    path: '/:id',
    handler: invoicesController.edit,
    bindTo: invoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'invoices',
    path: '/short',
    handler: invoicesController.invoicesShort,
    bindTo: invoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'invoices',
    path: '/:id',
    handler: invoicesController.invoice,
    bindTo: invoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'invoices',
    path: '/:id/confirm',
    handler: invoicesController.invoiceConfirm,
    bindTo: invoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
