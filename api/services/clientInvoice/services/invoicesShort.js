const { ClientInvoiceModel } = require('arroyo-erp-models');
// TODO: https://stackoverflow.com/questions/31084446/how-can-i-sort-into-that-nulls-are-last-ordered-in-mongodb
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
    .limit(Number(limit))
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
