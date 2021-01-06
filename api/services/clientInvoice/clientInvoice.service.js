const { ClientInvoiceModel } = require('arroyo-erp-models');

// Split services
const invoiceConfirm = require('./services/invoiceConfirm');
const create = require('./services/create');
const invoiceEdit = require('./services/invoiceEdit');
const refresh = require('./services/refresh');
const invoices = require('./services/invoices');
const invoicesShort = require('./services/invoicesShort');
// const exportOds = require('./services/export');
const invoiceDelete = require('./services/invoiceDelete');
// const swap = require('./services/swap');
const addDeliveryOrder = require('./services/addDeliveryOrder');
const editDeliveryOrder = require('./services/editDeliveryOrder');
const deleteDeliveryOrder = require('./services/deleteDeliveryOrder');

const addProduct = require('./services/addProduct');
const editProduct = require('./services/editProduct');
const deleteProduct = require('./services/deleteProduct');

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
  editDeliveryOrder,
  deleteDeliveryOrder,
  addProduct,
  editProduct,
  deleteProduct,
  invoiceConfirm,
  refresh,
  // exportOds,
  // swap,
};
