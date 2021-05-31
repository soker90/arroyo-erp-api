const { InvoiceModel } = require('arroyo-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Get all data for update
 * @param {Object} data
 * @param {Object} totals
 * @param {Object} payment
 * @returns {{}}
 * @private
 */
const _getDataForUpdate = (data, totals, payment) => {
  let newData = {};
  if (data) {
    const {
      dateRegister,
      dateInvoice,
      nInvoice,
      concept,
      mailSend,
    } = data;
    newData = {
      dateRegister,
      dateInvoice,
      nInvoice,
      concept,
      mailSend,
    };
  }

  if (totals) {
    const {
      total,
      iva,
      re,
      rate,
      taxBase,
    } = totals;
    newData = {
      ...newData,
      total: roundNumber(total),
      iva: roundNumber(iva),
      re: roundNumber(re),
      rate: roundNumber(rate),
      taxBase: roundNumber(taxBase),
    };
  }
  if (payment) {
    const {
      paymentDate,
      type,
      numCheque,
      paid,
      invoicesOrder,
    } = payment;

    newData = {
      ...newData,
      payment: {
        paymentDate,
        type,
        ...(numCheque && { numCheque }),
        paid,
        ...(invoicesOrder && { invoicesOrder }),
      },
    };
  }

  return newData;
};

/**
 * Modifica la factura
 * @param {String} id
 * @param {{dateRegister: number, dateInvoice: number, nInvoice: string}} data
 * @param {{total: number, iva: number, re: number, rate: number, taxBase: number}} totals
 * @param {{paymentDate: number, type: string, numCheque: string, paid: boolean, invoicesOrder: string}} payment
 * @returns {*}
 */
const invoiceEdit = ({
  params: { id },
  body: {
    data,
    totals,
    payment,
  },
}) => {
  const newData = _getDataForUpdate(data, totals, payment);

  return InvoiceModel
    .findOneAndUpdate({ _id: id }, newData, { new: true })
    .then(invoiceUpdated => ({
      invoice: invoiceUpdated,
      data: Boolean(data),
      totals: Boolean(totals),
      payment: Boolean(payment),
    }));
};

module.exports = invoiceEdit;
