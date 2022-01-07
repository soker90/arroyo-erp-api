const { ClientInvoiceModel } = require('arroyo-erp-models');
//TODO: https://stackoverflow.com/questions/31084446/how-can-i-sort-into-that-nulls-are-last-ordered-in-mongodb
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
  const invoices = await ClientInvoiceModel.find({ client }, '_id nInvoice date total')
    .sort({ date: -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit))
    .lean();

  const count = await ClientInvoiceModel.countDocuments({ client });

  return {
    invoices,
    count,
  };
};
module.exports = invoicesShort;
