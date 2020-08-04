/* eslint-disable nonblock-statement-body-position */
const { PaymentModel } = require('arroyo-erp-models');

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

module.exports = {
  create,
  payments,
  confirm,
  merge,
};
