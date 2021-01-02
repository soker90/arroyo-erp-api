const { ClientInvoiceModel } = require('arroyo-erp-models');

// Split services
// const invoiceConfirm = require('./services/invoiceConfirm');
const create = require('./services/create');
const invoiceEdit = require('./services/invoiceEdit');
// const refresh = require('./services/refresh');
const invoices = require('./services/invoices');
const invoicesShort = require('./services/invoicesShort');
// const expenseCreate = require('./services/expenseCreate');
// const exportOds = require('./services/export');
const invoiceDelete = require('./services/invoiceDelete');
// const swap = require('./services/swap');
const addDeliveryOrder = require('./services/addDeliveryOrder');

/**
 * Get invoice data
 * @param {String} id
 * @returns {Promise<*>}
 */
const invoice = ({ id }) => ClientInvoiceModel.findOne({ _id: id });

module.exports = {
  create,
  invoice,
  invoices,
  invoicesShort,
  invoiceEdit,
  invoiceDelete,
  addDeliveryOrder,
  // invoiceConfirm,
  // refresh,
  // expenseCreate,
  // exportOds,
  // swap,
};
