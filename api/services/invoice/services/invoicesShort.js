const { InvoiceModel } = require('arroyo-erp-models');

/**
 * Devuelve las facturas del proveedor
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoicesShort = ({
  provider, offset, limit,
}) => {
  const filter = {
    ...(provider && { provider }),
  };

  return InvoiceModel.find(filter, '_id nOrder nInvoice dateInvoice total payment.type payment.paid')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();
};

module.exports = invoicesShort;
