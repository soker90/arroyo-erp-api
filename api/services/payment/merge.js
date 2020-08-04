/* eslint-disable nonblock-statement-body-position */
const { PaymentModel } = require('arroyo-erp-models');
const { roundNumber } = require('../../../utils');

/**
 * Añade la variable merged al documento y lo devuelve
 * @param {String} payment
 * @returns {*}
 * @private
 */
const _addMergeParam = payment => PaymentModel.findOneAndUpdate({ _id: payment }, { merged: true });

/**
 * Crea un nuevo pago
 * @param {Number} amount
 * @param {String} nOrder
 * @param {Array<string>} invoices
 * @param {Array<string>} payments
 * @param {String} provider
 * @param {Number} paymentDate
 * @param {String} type
 * @param {String} numCheque
 * @returns {Promise<void>}
 * @private
 */
const _createPayment = (
  amount, nOrder, invoices, payments, {
    provider, paymentDate, type, numCheque,
  },
) => (
  new PaymentModel({
    provider,
    ...(paymentDate && { paymentDate }),
    type,
    ...(numCheque && { numCheque }),
    payments,
    invoices,
    amount: roundNumber(amount),
    nOrder,
  }).save()
);

/**
 * Fusiona varios pagos
 * @param {Array<String>} payments
 * @returns {Promise<void>}
 */
const merge = async ({ payments }) => {
  let firstPayment = null;
  let amount = 0;
  let nOrder = '';
  let invoices = [];

  for (const payment of payments) {
    const paymentData = await _addMergeParam(payment);
    amount += paymentData.amount;
    nOrder += `${paymentData.nOrder} `;
    invoices = invoices.concat(paymentData.invoices);
    if (!firstPayment) firstPayment = paymentData;
  }

  await _createPayment(amount, nOrder, invoices, payments, firstPayment);
};

module.exports = merge;
