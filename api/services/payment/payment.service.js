/* eslint-disable nonblock-statement-body-position */
const { PaymentModel } = require('arroyo-erp-models');
const Promise = require('bluebird');

const merge = require('./merge');
const confirm = require('./confirm');

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
 * Elimina el pago fusionado y elimina el tag merged a los antiguos pagos
 * @param {String} id
 * @returns {Promise<void>}
 */
const divide = async ({ id }) => {
  const mergePayment = await PaymentModel.findOne({ _id: id });

  await Promise.map(
    mergePayment.payments,
    payment => (
      PaymentModel.findOneAndUpdate({ _id: payment }, { merge: false })
    ),
  );

  await PaymentModel.deleteOne({ _id: id });
};

module.exports = {
  create,
  payments,
  confirm,
  merge,
  divide,
};
