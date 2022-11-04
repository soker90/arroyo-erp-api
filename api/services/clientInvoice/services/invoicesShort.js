const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Devuelve las facturas del cliente
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoicesShort = async ({
  client,
  offset,
  limit,
}) => {
  let invoices = await ClientInvoiceModel.find({
    client,
    nInvoice: { $exists: true },
  }, '_id nInvoice date total')
    .sort({ date: -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit) || 10)
    .lean();

  const invoicesInProgress = await ClientInvoiceModel.find({
    client,
    nInvoice: { $exists: false },
  }, '_id nInvoice date total')
    .lean();

  invoices = [
    ...invoicesInProgress,
    ...invoices,
  ];
  const count = await ClientInvoiceModel.countDocuments({ client, nInvoice: { $exists: true } });
  return {
    invoices,
    count,
  };
};
module.exports = invoicesShort;
