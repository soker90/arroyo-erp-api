const {
  ClientInvoiceModel,
} = require('arroyo-erp-models');

/**
 * Delete invoice
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoiceDelete = ({ id }) => ClientInvoiceModel.findOneAndDelete({ _id: id });

module.exports = invoiceDelete;
