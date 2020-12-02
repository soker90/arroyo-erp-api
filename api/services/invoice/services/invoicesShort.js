const { InvoiceModel } = require('arroyo-erp-models');

/**
 * Devuelve las facturas del proveedor
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoicesShort = async ({
  provider,
  offset,
  limit,
}) => {
  const filter = {
    ...(provider && { provider }),
  };

  const invoices = await InvoiceModel.find(filter, '_id nOrder nInvoice dateInvoice total payment.type payment.paid')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();

  invoices.sort(a => (a.nOrder ? 0 : -1));
  return invoices;
};
module.exports = invoicesShort;
