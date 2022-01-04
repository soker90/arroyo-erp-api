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
  ...(totals && { totals: totalsResponse(invoice) }),
});

const initBillingData = client => ({
  client: client._id.client,
  name: client._id.businessName ?? client._id.name,
  invoices1: 0,
  trimester2: 0,
  invoices2: 0,
  trimester3: 0,
  invoices3: 0,
  trimester4: 0,
  invoices4: 0,
  annual: 0,
  annualInvoices: 0,
});

const billingAdapter = billingData => {
  const billing = {};
  billingData.forEach(clientTrimester => {
    const clientId = clientTrimester._id.client;
    const { trimester } = clientTrimester._id;
    if (!billing[clientId]) billing[clientId] = initBillingData(clientTrimester);

    billing[clientId][`trimester${trimester}`] = clientTrimester.sum;
    billing[clientId][`invoices${trimester}`] = clientTrimester.count;

    billing[clientId].annual += clientTrimester.sum;
    billing[clientId].annualInvoices += clientTrimester.count;
  });

  return Object.values(billing);
};

module.exports = {
  conditionalDataTotalsResponse,
  billingAdapter,
};
