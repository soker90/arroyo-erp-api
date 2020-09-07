const AccountService = require('./account.service');
const BillingService = require('./billing');
const DeliveryOrderService = require('./deliveryorder');
const InvoiceService = require('./invoice');
const NoteService = require('./note');
const PaymentService = require('./payment');
const ProductService = require('./product');
const ProviderService = require('./provider');

module.exports = {
  accountService: AccountService,
  billingService: BillingService,
  deliveryOrderService: DeliveryOrderService,
  invoiceService: InvoiceService,
  noteService: NoteService,
  paymentService: PaymentService,
  productService: ProductService,
  providerService: ProviderService,
};
