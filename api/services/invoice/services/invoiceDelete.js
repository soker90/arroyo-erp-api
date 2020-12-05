const {
  InvoiceModel,
  BillingModel,
  DeliveryOrderModel,
  PaymentModel,
} = require('arroyo-erp-models');

/**
 * Get all invoices
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoiceDelete = async ({ id }) => {
// await PaymentModel.deleteOne()
  console.log('dd');

  return InvoiceModel.find({
    dateRegister: {
      $gte: start,
      $lt: end,
    },
  }, '_id businessName nOrder dateInvoice total dateRegister dateInvoice nInvoice concept')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();
};

module.exports = invoiceDelete;
