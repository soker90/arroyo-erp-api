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

  const invoices = await InvoiceModel.find({
    ...filter,
    nOrder: { $exists: true },
  }, '_id nOrder nInvoice dateInvoice total payment.type payment.paid mailSend payment.paymentDate')
    .sort({
      dateRegister: -1,
      nOrder: -1,
    })
    .skip(Number(offset || 0))
    .limit(Number(limit || 10))
    .lean();

  const invoicesInProgress = await InvoiceModel.find(
    {
      ...filter,
      nOrder: { $exists: false },
    },
    '_id nOrder nInvoice dateInvoice total payment.type payment.paid mailSend'
  )
    .lean();

  const count = await InvoiceModel.countDocuments({
    ...filter,
    nOrder: { $exists: true },
  });

  return {
    invoices: [
      ...invoicesInProgress,
      ...invoices,
    ],
    count,
  };
};
module.exports = invoicesShort;
