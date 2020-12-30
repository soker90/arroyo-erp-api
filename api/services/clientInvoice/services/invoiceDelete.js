const {
  InvoiceModel,
} = require('arroyo-erp-models');

// const deleteA = await PaymentModel.deleteOne({ invoices: id });
/**
 * Get all invoices
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoiceDelete = ({ id }) => InvoiceModel.findOneAndDelete({ _id: id });

module.exports = invoiceDelete;
