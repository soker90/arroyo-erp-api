/* eslint-disable nonblock-statement-body-position */
const { PaymentModel, InvoiceModel } = require('arroyo-erp-models');

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
const payments = () => PaymentModel.find({ paid: { $exists: false } });

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

module.exports = {
  create,
  payments,
  confirm,
};
