const deliveryOrderValidator = require('./deliveryorder');
const invoiceValidator = require('./invoice');
const noteValidator = require('./note');
const paymentValidator = require('./payment');
const productValidator = require('./product');
const providerValidator = require('./provider');

module.exports = {
  deliveryOrderValidator,
  invoiceValidator,
  noteValidator,
  paymentValidator,
  productValidator,
  providerValidator,
};
