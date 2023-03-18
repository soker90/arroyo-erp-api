const AccountService = require('./account.service');
const AutoIncrementService = require('./autoincrement');
const BillingService = require('./billing');
const ClientService = require('./client');
const ClientInvoiceService = require('./clientInvoice');
const DashboardService = require('./dashboard');
const DeliveryOrderService = require('./deliveryorder');
const InvoiceService = require('./invoice');
const NoteService = require('./note');
const PaymentService = require('./payment');
const PriceService = require('./price');
const ProductService = require('./product');
const ProductPvpService = require('./productpvp');
const ProviderService = require('./provider');
const ReminderService = require('./reminder');

module.exports = {
  accountService: AccountService,
  autoIncrementService: AutoIncrementService,
  billingService: BillingService,
  clientService: ClientService,
  clientInvoiceService: ClientInvoiceService,
  dashboardService: DashboardService,
  deliveryOrderService: DeliveryOrderService,
  invoiceService: InvoiceService,
  noteService: NoteService,
  paymentService: PaymentService,
  priceService: PriceService,
  productService: ProductService,
  productPvpService: ProductPvpService,
  providerService: ProviderService,
  reminderService: ReminderService,
};
