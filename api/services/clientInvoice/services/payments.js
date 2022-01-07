const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Devuelve las facturas pendientes de pago de los clientes
 * @returns {Promise<*>}
 */
const payments = () => ClientInvoiceModel.find({
  nInvoice: { $exists: true },
  paid: { $exists: false },
}, '_id nInvoice date total nameClient')
  .sort({ date: -1 });

module.exports = payments;
