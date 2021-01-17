const billingErrors = require('./billing.errors');
const commonErrors = require('./common-errors');
const clientErrors = require('./client.errors');
const deliveryOrderErrors = require('./delivery-order.errors');
const invoiceErrors = require('./invoice.errors');
const noteErrors = require('./note.errors');
const paymentErrors = require('./payment.errors');
const priceChangeErrors = require('./price-change.errors');
const productErrors = require('./product.errors');
const providerErrors = require('./provider.errors');
const reminderErrors = require('./reminder.errors');
const userErrors = require('./user.errors');

module.exports = {
  billingErrors,
  commonErrors,
  clientErrors,
  deliveryOrderErrors,
  invoiceErrors,
  noteErrors,
  paymentErrors,
  priceChangeErrors,
  productErrors,
  providerErrors,
  reminderErrors,
  userErrors,
};
