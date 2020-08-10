const invoiceValidator = require('./invoice');
const paymentValidator = require('./payment');
const deliveryOrderValidator = require('./deliveryorder');
const productValidator = require('./product');

module.exports = {
  invoiceValidator,
  paymentValidator,
  deliveryOrderValidator,
  productValidator,
};
