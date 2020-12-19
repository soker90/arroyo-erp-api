const billingValidator = require('./billing');
const clientValidator = require('./client');
const deliveryOrderValidator = require('./deliveryorder');
const invoiceValidator = require('./invoice');
const noteValidator = require('./note');
const paymentValidator = require('./payment');
const productValidator = require('./product');
const providerValidator = require('./provider');
const reminderValidator = require('./reminder');

module.exports = {
  billingValidator,
  clientValidator,
  deliveryOrderValidator,
  invoiceValidator,
  noteValidator,
  paymentValidator,
  productValidator,
  providerValidator,
  reminderValidator,
};
