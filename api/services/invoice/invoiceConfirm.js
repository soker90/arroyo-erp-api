const { InvoiceModel, AutoIncrement, PaymentModel } = require('arroyo-erp-models');
const {
  refreshBilling, addNOrderToDeliveryOrder,
} = require('./utils');

/**
 * Generate new order number for the year
 * @param {Number} date
 * @returns {Promise<number>}
 * @private
 */
const _generateOrderNumber = date => {
  const dateInvoice = new Date(date);
  return AutoIncrement.increment(`invoice${dateInvoice.getFullYear()}`);
};

/**
 * Genera el número de orden correspondiente a la factura
 * @param {String} id
 * @param {Number} datePayment
 * @param {String} type
 * @returns {Promise<{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}>}
 */
const invoiceConfirm = async ({ params: { id }, body: { paymentDate, type } }) => {
  const invoiceData = await InvoiceModel.findOne({ _id: id });
  invoiceData.nOrder = await _generateOrderNumber(invoiceData.dateInvoice);

  invoiceData.payment = {
    paymentDate,
    type,
  };

  await invoiceData.save()
    .then(addNOrderToDeliveryOrder)
    .then(() => refreshBilling(invoiceData.dateInvoice, invoiceData.provider));

  return invoiceData;
};

module.exports = invoiceConfirm;
