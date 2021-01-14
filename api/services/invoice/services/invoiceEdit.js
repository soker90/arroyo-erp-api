const { InvoiceModel } = require('arroyo-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Get all data for update
 * @param {Object} data
 * @param {Object} totals
 * @returns {{}}
 * @private
 */
const _getDataForUpdate = (data, totals) => {
  let newData = {};
  if (data) {
    const {
      dateRegister, dateInvoice, nInvoice, concept, mailSend,
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
      total, iva, re, rate, taxBase,
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

  return newData;
};

/**
 * Modifica la factura
 * @param {String} id
 * @param {{dateRegister: number, dateInvoice: number, nInvoice: string}} data
 * @param {{total: number, iva: number, re: number, rate: number, taxBase: number}} totals
 * @returns {*}
 */
const invoiceEdit = ({ params: { id }, body: { data, totals } }) => {
  const newData = _getDataForUpdate(data, totals);

  return InvoiceModel
    .findOneAndUpdate({ _id: id }, newData, { new: true })
    .then(invoiceUpdated => ({
      invoice: invoiceUpdated,
      data: Boolean(data),
      totals: Boolean(totals),
    }));
};

module.exports = invoiceEdit;
