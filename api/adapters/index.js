const billingAdapter = require('./billing');
const clientInvoiceAdapter = require('./clientInvoice');
const deliveryOrderAdapter = require('./deliveryorders');
const invoiceAdapter = require('./invoice');

module.exports = {
  billingAdapter,
  clientInvoiceAdapter,
  deliveryOrderAdapter,
  invoiceAdapter,
};
