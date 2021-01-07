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
    .sort({
      dateRegister: -1,
      nOrder: -1,
    })
    .skip(Number(offset || 0))
    .limit(Number(limit || 10))
    .lean();

  invoices.sort(a => (a.nOrder ? 0 : -1));

  const count = await InvoiceModel.countDocuments(filter);

  return {
    invoices,
    count,
  };
};

module.exports = invoicesShort;
