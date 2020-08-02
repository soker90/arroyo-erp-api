const commonErrors = require('./common-errors');
const deliveryOrderErrors = require('./delivery-order.errors');
const invoiceErrors = require('./invoice.errors');
const paymentErrors = require('./payment.errors');
const productErrors = require('./product.errors');
const providerErrors = require('./provider.errors');
const userErrors = require('./user.errors');
const validationErrors = require('./validation.error');

module.exports = {
  commonErrors,
  deliveryOrderErrors,
  invoiceErrors,
  paymentErrors,
  productErrors,
  providerErrors,
  userErrors,
  validationErrors,
};
