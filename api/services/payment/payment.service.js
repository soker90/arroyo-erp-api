/* eslint-disable nonblock-statement-body-position */
const { PaymentModel, InvoiceModel } = require('arroyo-erp-models');
const { roundNumber } = require('../../../utils');

/**
 * Create payment
 * @return {Promise<string>}
 */
const create = async invoice => {
  const paymentData = await new PaymentModel({
    provider: invoice.nameProvider,
    paymentDate: invoice.payment.paymentDate,
    type: invoice.payment.type,
    invoices: [invoice._id],
    nOrder: invoice.nOrder,
    amount: invoice.total,
  });

  paymentData.save();
};

// TODO Ordenar conforme sea necesario
/**
 *Devuelve todos los pagos no abonados
 * @returns {*}
 */
const payments = () => PaymentModel.find({
  paid: { $exists: false },
  $or: [{ merged: { $exists: false } }, { merged: false }],
});

/**
 * Confirma la realización del pago
 * @param {String} id
 * @param {number} paymentDate
 * @param {string} type
 * @param {string} numCheque
 * @returns {Promise<void>}
 */
const confirm = async ({ params: { id }, body: { paymentDate, type, numCheque } }) => {
  const paymentData = {
    paymentDate,
    type,
    ...(numCheque && { numCheque }),
    paid: true,
  };

  const payment = await PaymentModel
    .findOneAndUpdate({ _id: id }, paymentData, { new: true });

  for (const invoiceId of payment.invoices)
    await InvoiceModel.findOneAndUpdate({ _id: invoiceId }, { payment: paymentData });
};

// TODO refactor, sin terminar, hora de cenar
const merge = async ({ payments }) => {
  let firstPayment = null;
  let amount = 0;
  let nOrder = '';
  let invoices = [];
  for (const payment of payments) {
    const paymentData = await PaymentModel.findOneAndUpdate({ _id: payment }, { merged: true });
    amount += paymentData.amount;
    nOrder += `${paymentData.nOrder} `;
    invoices = invoices.concat(paymentData.invoices);
    if (!firstPayment) firstPayment = paymentData;
    paymentData.set('merged', true);
    paymentData.save();
  }

  const {
    provider, paymentDate, type, numCheque,
  } = firstPayment;

  await new PaymentModel({
    provider,
    ...(paymentDate && { paymentDate }),
    type,
    ...(numCheque && { numCheque }),
    payments,
    invoices,
    amount: roundNumber(amount),
    nOrder,
  }).save();
};

module.exports = {
  create,
  payments,
  confirm,
  merge,
};
