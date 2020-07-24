/**
 * Devuelve un objecto con los datos de la factura
 * @param invoice
 * @returns {{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}}
 */
const invoiceDataAdapter = invoice => ({
  dateRegister: invoice.dateRegister,
  dateInvoice: invoice.dateInvoice,
  nOrder: invoice.nOrder,
  nInvoice: invoice.nInvoice,
});

/**
 * Devuelve un objecto con los dato y totales de la factura
 * @param {object} invoice
 * @returns {{data: {nOrder: *, dateRegister: (number|Requireable<number>),
 * dateInvoice: number, nInvoice: (string|Requireable<string>|Requireable<number>|string)},
 * totals: {total: *, re: *, iva: *, taxBase: *}}}
 */
const invoiceDataAndTotals = invoice => ({
  data: invoiceDataAdapter(invoice),
  totals: {
    taxBase: invoice.taxBase,
    iva: invoice.iva,
    re: invoice.re,
    total: invoice.total,
  },
});

/**
 * Return adapted object with invoice data
 * @param invoice
 * @returns {{deliveryOrders: {date: *, total: *, products: *}[],
 * data: {nOrder: (number|{$exists: boolean}|Number|NumberConstructor),
 * dateRegister: Number | NumberConstructor | Requireable<number>,
 * dateInvoice: Number | NumberConstructor | Requireable<number>,
 * nInvoice: String | StringConstructor}, provider: *,
 * totals: {total: *, re: *, iva: *, taxBase: *},
 * nameProvider: (null|Requireable<string>)}}
 */
const invoiceAdapter = invoice => ({
  id: invoice._id,
  provider: invoice.provider,
  nameProvider: invoice.nameProvider,
  ...invoiceDataAndTotals(invoice),
  deliveryOrders: invoice.deliveryOrders.map(deliveryOrder => ({
    _id: deliveryOrder._id,
    date: deliveryOrder.date,
    taxBase: deliveryOrder.taxBase,
    products: deliveryOrder.products.map(product => ({
      price: product.price,
      quantity: product.quantity,
      name: product.name,
      taxBase: product.taxBase,
    })),
  })),
});

module.exports = {
  invoiceAdapter,
  invoiceDataAndTotals,
  invoiceDataAdapter,
};
