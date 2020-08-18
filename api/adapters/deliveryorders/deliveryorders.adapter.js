/**
 * Get delivery orders response for @ordersResponse
 * @param {Array} inInvoices
 * @param {Number} inInvoiceCount
 * @returns {{data: Array, count: Number}}
 * @private
 */
const _inInvoiceResponse = ({ inInvoices, inInvoiceCount }) => {
  const data = inInvoices.map(
    ({
      _id, date, total, nOrder, nInvoice,
    }) => ({
      _id,
      date,
      total,
      nOrder,
      nInvoice,
    }),
  );

  return {
    count: inInvoiceCount,
    data,
  };
};

/**
 * Get free response for @ordersResponse
 * @param {Array} free
 * @returns {Array}
 * @private
 */
const _freeResponse = ({ free }) => free.map(({
  _id, date, taxBase, products,
}) => ({
  _id,
  date,
  taxBase,
  products: products.map(({
    name, price, quantity, taxBase: totalProduct,
  }) => ({
    name,
    price,
    quantity,
    taxBase: totalProduct,
  })),
}));

/**
 * Return get orders response
 * @param {{inInvoices: Array, inInvoiceCount: Array, free: Number}} data
 * @returns {{inInvoices: {data: *, count: *}, free: *}}
 */
const ordersResponse = data => ({
  free: _freeResponse(data),
  inInvoices: _inInvoiceResponse(data),
});

/**
 * Create object with totals
 * @return {{total: Number, re: Number, iva: Number}}
 * @private
 */
const _generateTotals = ({
  iva, re, total, taxBase, rate,
}) => ({
  iva,
  re,
  total,
  taxBase,
  rate,
});

/**
 * Create JSON for response of create
 * @return {
 * {date: *, provider: *, _id: *, totals:
 * {total: Number, re: Number, iva: Number},
 * nameProvider: *, products: *}}
 */
const standardResponse = ({
  _id, provider, nameProvider, products, date, nOrder, invoice, iva, re, total, taxBase, rate,
}) => ({
  _id,
  provider,
  nameProvider,
  date,
  products,
  nOrder,
  invoice,
  totals: _generateTotals({
    iva,
    re,
    total,
    taxBase,
    rate,
  }),
});

/**
 * Create JSON for response for basic data
 * @return {{date: *, nameProvider: *}}
 */
const basicResponse = ({ _id, date }) => ({
  _id,
  date,
});

module.exports = {
  ordersResponse,
  standardResponse,
  basicResponse,
};
