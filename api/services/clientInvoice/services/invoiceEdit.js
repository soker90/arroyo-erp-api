const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Modifica la factura de cliente
 * @param {String} id
 * @param {number} date
 * @param {{total: number, iva: number, taxBase: number}} totals
 * @returns {*}
 */
const clientInvoiceEdit = ({
  params: { id },
  body: {
    date,
    totals,
  },
}) => {
  const newData = {
    ...(date && { date }),
    ...(totals && {
      total: totals.total,
      iva: totals.iva,
      taxBase: totals.taxBase,
    }),
  };
  return ClientInvoiceModel
    .findOneAndUpdate({ _id: id }, newData, { new: true })
    .then(invoiceUpdated => ({
      invoice: invoiceUpdated,
      date: Boolean(date),
      totals: Boolean(totals),
    }));
};

module.exports = clientInvoiceEdit;
