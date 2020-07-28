const AccountService = require('./account.service');
const ProductService = require('./product');
const ProviderService = require('./provider');
const DeliveryOrderService = require('./deliveryorder');
const InvoiceService = require('./invoice');
const PaymentService = require('./payment');

module.exports = {
  accountService: AccountService,
  productService: ProductService,
  providerService: ProviderService,
  deliveryOrderService: DeliveryOrderService,
  invoiceService: InvoiceService,
  paymentService: PaymentService,
};
