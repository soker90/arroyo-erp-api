/**
 * Devuelve los totales de la factura
 * @param invoice
 * @returns {{total: *, re: *, iva: *, taxBase: *}}
 */
const totalsResponse = invoice => ({
  taxBase: invoice.taxBase,
  iva: invoice.iva,
  total: invoice.total,
});

/**
 * Return data or/and totals of the invoice
 * @param {Object} invoice
 * @param {Boolean} data
 * @param {Boolean} totals
 * @returns {{}}
 */
const conditionalDataTotalsResponse = ({
  invoice,
  date,
  totals,
}) => ({
  ...(date && { date: invoice.date }),
  ...(totals && totalsResponse(invoice)),
});

module.exports = {
  conditionalDataTotalsResponse,
};
