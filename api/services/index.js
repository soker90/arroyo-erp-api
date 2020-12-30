const AccountService = require('./account.service');
const AutoIncrementService = require('./autoincrement');
const BillingService = require('./billing');
const ClientService = require('./client');
const ClientInvoiceService = require('./clientInvoice');
const DeliveryOrderService = require('./deliveryorder');
const InvoiceService = require('./invoice');
const NoteService = require('./note');
const PaymentService = require('./payment');
const PriceService = require('./price');
const ProductService = require('./product');
const ProviderService = require('./provider');
const ReminderService = require('./reminder');

module.exports = {
  accountService: AccountService,
  autoIncrementService: AutoIncrementService,
  billingService: BillingService,
  clientService: ClientService,
  clientInvoiceService: ClientInvoiceService,
  deliveryOrderService: DeliveryOrderService,
  invoiceService: InvoiceService,
  noteService: NoteService,
  paymentService: PaymentService,
  priceService: PriceService,
  productService: ProductService,
  providerService: ProviderService,
  reminderService: ReminderService,
};
