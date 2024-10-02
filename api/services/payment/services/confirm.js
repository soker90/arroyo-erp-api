/* eslint-disable nonblock-statement-body-position */
const {
  PaymentModel,
  InvoiceModel,
} = require('arroyo-erp-models');

/**
 * Actualiza las facturas con la información del pago
 * @param {Array<string>} invoices
 * @param {Object} paymentData
 * @returns {Promise<void>}
 * @private
 */
const _updateInvoices = async ({
  invoices,
  nOrder,
}, paymentData) => {
  const payment = {
    ...paymentData,
    ...(invoices.length > 1 && { invoicesOrder: nOrder }),
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const invoiceId of invoices)
  // eslint-disable-next-line no-await-in-loop
    await InvoiceModel.findOneAndUpdate({ _id: invoiceId }, { payment });
};
/**
 * Confirma la realización del pago
 * @param {String} id
 * @param {number} paymentDate
 * @param {string} type
 * @param {string} numCheque
 * @returns {Promise<void>}
 */
const confirm = async ({
  params: { id },
  body: {
    paymentDate,
    type,
    numCheque,
  },
}) => {
  const paymentData = {
    paymentDate,
    type,
    ...(numCheque && { numCheque }),
    paid: true,
  };

  const payment = await PaymentModel.findOne({ _id: id });
  await _updateInvoices(payment, paymentData);
  await PaymentModel.deleteOne({ _id: id });
  await PaymentModel.deleteMany({ _id: { $in: payment.payments } });
};

module.exports = confirm;
