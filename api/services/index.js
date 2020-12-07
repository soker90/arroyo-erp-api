const AccountService = require('./account.service');
const AutoIncrementService = require('./autoincrement');
const ClientService = require('./client');
const BillingService = require('./billing');
const DeliveryOrderService = require('./deliveryorder');
const InvoiceService = require('./invoice');
const NoteService = require('./note');
const PaymentService = require('./payment');
const ProductService = require('./product');
const ProviderService = require('./provider');

module.exports = {
  accountService: AccountService,
  autoIncrementService: AutoIncrementService,
  clientService: ClientService,
  billingService: BillingService,
  deliveryOrderService: DeliveryOrderService,
  invoiceService: InvoiceService,
  noteService: NoteService,
  paymentService: PaymentService,
  productService: ProductService,
  providerService: ProviderService,
};
