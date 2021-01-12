const services = require('../../services');
const validators = require('../../validators');
const adapters = require('../../adapters');

const AccountController = require('./account');
const BillingController = require('./billings');
const ClientController = require('./client');
const ClientInvoicesController = require('./clientInvoices');
const DashboardController = require('./dashboard');
const DeliveryOrderController = require('./deliveryorders');
const InvoiceController = require('./invoices');
const NoteController = require('./notes');
const PaymentController = require('./payments');
const PriceChangesController = require('./pricechange');
const ProductController = require('./products');
const ProviderController = require('./providers');

module.exports = [
  ...AccountController(services),
  ...BillingController(services, validators, adapters),
  ...ClientController(services, validators),
  ...ClientInvoicesController(services, validators, adapters),
  ...DashboardController(services, validators),
  ...DeliveryOrderController(services, validators, adapters),
  ...InvoiceController(services, validators, adapters),
  ...NoteController(services, validators),
  ...PaymentController(services, validators),
  ...PriceChangesController(services, validators),
  ...ProductController(services, validators),
  ...ProviderController(services, validators),
];
