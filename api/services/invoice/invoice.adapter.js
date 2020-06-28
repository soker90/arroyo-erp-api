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
  provider: invoice.provider,
  nameProvider: invoice.nameProvider,
  data: {
    dateRegister: invoice.dateRegister,
    dateInvoice: invoice.dateInvoice,
    nOrder: invoice.nOrder,
    nInvoice: invoice.nInvoice,
  },
  totals: {
    taxBase: invoice.taxBase,
    iva: invoice.iva,
    re: invoice.re,
    total: invoice.total,
  },
  deliveryOrders: invoice.deliveryOrders.map(deliveryOrder => ({
    _id: deliveryOrder._id,
    date: deliveryOrder.date,
    total: deliveryOrder.total,
    products: deliveryOrder.products.map(product => ({
      price: product.price,
      quantity: product.quantity,
      name: product.name,
      total: product.total,
    })),
  })),
});

module.exports = {
  invoiceAdapter,
};
