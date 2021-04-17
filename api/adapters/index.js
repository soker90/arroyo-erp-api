const billingAdapter = require('./billing');
const clientInvoiceAdapter = require('./clientInvoice');
const clientAdapter = require('./client');
const deliveryOrderAdapter = require('./deliveryorders');
const invoiceAdapter = require('./invoice');

module.exports = {
  billingAdapter,
  clientInvoiceAdapter,
  clientAdapter,
  deliveryOrderAdapter,
  invoiceAdapter,
};
