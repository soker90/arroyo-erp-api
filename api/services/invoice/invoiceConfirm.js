const { InvoiceModel, AutoIncrement, PaymentModel } = require('arroyo-erp-models');
const {
  InvoiceIdNotFound,
  InvoiceInvalidDateInvoice,
  InvoiceWithOrderNumber,
} = require('../../../errors/invoice.errors');
const {
  refreshBilling, addNOrderToDeliveryOrder,
} = require('./utils');

/**
 * Find invoice data from model
 * @param {String} id
 * @returns {Object}
 * @private
 */
const _findInvoice = async id => {
  await InvoiceModel.findOne({ _id: id });
  const invoiceData = await InvoiceModel.findOne({ _id: id });

  if (!invoiceData) throw new InvoiceIdNotFound();
  if (!invoiceData.dateInvoice || typeof invoiceData.dateInvoice !== 'number') throw new InvoiceInvalidDateInvoice();
  if (invoiceData.nOrder) throw new InvoiceWithOrderNumber();

  return invoiceData;
};

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

/*
const createPayment = async (ids, invoices, datePayment, paymentType) => {
  const payment = await PaymentModel({
    provider: invoiceData[0].provider,
    nameProvider: invoiceData[0].nameProvider,
    datePayment,
    paymentType,
    invoices: ids,
    nOrder: invoiceData.nOrder,
  });

  payment.save();
}; */

/**
 * Genera el número de orden correspondiente a la factura
 * @param {String} id
 * @returns {Promise<{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}>}
 */
const invoiceConfirm = async ({ id }) => {
  const invoiceData = _findInvoice(id);
  invoiceData.nOrder = await _generateOrderNumber(invoiceData.dateInvoice);

  invoiceData.save()
    .then(addNOrderToDeliveryOrder)
    .then(() => refreshBilling(invoiceData.dateInvoice, invoiceData.provider));

  return invoiceData;
};

module.exports = invoiceConfirm;
