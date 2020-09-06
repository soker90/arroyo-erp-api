const services = require('../../services');
const validators = require('../../validators');
const adapters = require('../../adapters');

const AccountController = require('./account');
const DeliveryOrderController = require('./deliveryorders');
const InvoiceController = require('./invoices');
const PaymentController = require('./payments');
const ProductController = require('./products');
const ProviderController = require('./providers');

module.exports = [
  ...AccountController(services),
  ...DeliveryOrderController(services, validators, adapters),
  ...InvoiceController(services, validators, adapters),
  ...PaymentController(services, validators),
  ...ProductController(services, validators, adapters),
  ...ProviderController(services, validators),
];
