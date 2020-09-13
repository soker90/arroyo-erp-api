/* eslint-disable nonblock-statement-body-position */
const { PaymentModel } = require('arroyo-erp-models');
const { roundNumber } = require('../../../../utils');

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
 * @returns {Promise<void>}
 * @private
 */
const _createPayment = ({
  amount, nOrder, invoices, payments, nInvoice,
  firstPayment: {
    provider, paymentDate, type,
  }
  ,
}) => (
  new PaymentModel({
    provider,
    ...(paymentDate && { paymentDate }),
    type,
    payments,
    invoices,
    amount: roundNumber(amount),
    nOrder,
    nInvoice,
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
  let nInvoice = '';

  // eslint-disable-next-line no-restricted-syntax
  for (const payment of payments) {
    // eslint-disable-next-line no-await-in-loop
    const paymentData = await _addMergeParam(payment);
    amount += paymentData.amount;
    nOrder += `${paymentData.nOrder}, `;
    nInvoice += `${paymentData.nInvoice}, `;
    invoices = invoices.concat(paymentData.invoices);
    if (!firstPayment) firstPayment = paymentData;
  }

  await _createPayment({
    amount,
    nOrder,
    invoices,
    payments,
    nInvoice,
    firstPayment,
  });
};

module.exports = merge;
