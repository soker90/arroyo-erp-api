/**
 * devuelve un objecto con los datos de la factura
 * @param invoice
 * @returns {{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}}
 */
const dataResponse = invoice => ({
  dateRegister: invoice.dateRegister,
  dateInvoice: invoice.dateInvoice,
  nOrder: invoice.nOrder,
  nInvoice: invoice.nInvoice,
  concept: invoice.concept,
});

/**
 * Devuelve los totales de la factura
 * @param invoice
 * @returns {{total: *, re: *, iva: *, taxBase: *}}
 */
const totalsResponse = invoice => ({
  taxBase: invoice.taxBase,
  iva: invoice.iva,
  re: invoice.re,
  total: invoice.total,
});

/**
 * Devuelve la infomación del pago
 * @param {Object} payment
 * @returns {{[numCheque]: String, paid: Boolean, type: String, paymentDate: Number}}
 */
const paymentResponse = ({ payment }) => ({
  type: payment.type,
  paymentDate: payment.paymentDate,
  ...(payment.numCheque && { numCheque: payment.numCheque }),
  paid: Boolean(payment.paid),
  ...(payment.invoicesOrder && { invoicesOrder: payment.invoicesOrder }),
});

/**
 * devuelve un objecto con los dato y totales de la factura
 * @param {object} invoice
 * @returns {{data: {nOrder: *, dateRegister: (number|Requireable<number>),
 * dateInvoice: number, nInvoice: (string|Requireable<string>|Requireable<number>|string)},
 * totals: {total: *, re: *, iva: *, taxBase: *}}}
 */
const dataAndTotalsResponse = invoice => ({
  data: dataResponse(invoice),
  totals: totalsResponse(invoice),
});

/**
 * devuelve un objecto con los dato y totales de la factura
 * @param {object} invoice
 * @returns {{data: {nOrder: *, dateRegister: (number|Requireable<number>),
 * dateInvoice: number, nInvoice: (string|Requireable<string>|Requireable<number>|string)},
 * totals: {total: *, re: *, iva: *, taxBase: *}}}
 */
const dataAndPaymentResponse = invoice => ({
  data: dataResponse(invoice),
  payment: paymentResponse(invoice),
});

/**
 * Return data or/and totals of the invoice
 * @param {Object} invoice
 * @param {Boolean} data
 * @param {Boolean} totals
 * @returns {{}}
 */
const conditionalDataTotalsResponse = ({ invoice, data, totals }) => ({
  ...(data && { data: dataResponse(invoice) }),
  ...(totals && { totals: totalsResponse(invoice) }),
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
const fullResponse = invoice => ({
  id: invoice._id,
  provider: invoice.provider,
  nameProvider: invoice.nameProvider,
  ...dataAndTotalsResponse(invoice),
  deliveryOrders: invoice.deliveryOrders.map(deliveryOrder => ({
    _id: deliveryOrder._id,
    date: deliveryOrder.date,
    taxBase: deliveryOrder.taxBase,
    iva: deliveryOrder.iva,
    re: deliveryOrder.re,
    total: deliveryOrder.total,
    products: deliveryOrder.products.map(product => ({
      price: product.price,
      quantity: product.quantity,
      name: product.name,
      taxBase: product.taxBase,
    })),
  })),
  ...(invoice.payment.type && { payment: paymentResponse(invoice) }),
});

module.exports = {
  fullResponse,
  dataAndTotalsResponse,
  dataResponse,
  conditionalDataTotalsResponse,
  dataAndPaymentResponse,
};
