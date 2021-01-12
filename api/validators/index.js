const billingValidator = require('./billing');
const clientValidator = require('./client');
const clientInvoiceValidator = require('./clientInvoice');
const deliveryOrderValidator = require('./deliveryorder');
const invoiceValidator = require('./invoice');
const noteValidator = require('./note');
const paymentValidator = require('./payment');
const priceChangeValidator = require('./pricechange');
const productValidator = require('./product');
const providerValidator = require('./provider');
const reminderValidator = require('./reminder');

module.exports = {
  billingValidator,
  clientValidator,
  clientInvoiceValidator,
  deliveryOrderValidator,
  invoiceValidator,
  noteValidator,
  paymentValidator,
  priceChangeValidator,
  productValidator,
  providerValidator,
  reminderValidator,
};
