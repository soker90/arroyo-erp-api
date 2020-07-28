/* eslint-disable nonblock-statement-body-position */
const { PaymentModel } = require('arroyo-erp-models');

/**
 * Create payment
 * @return {Promise<string>}
 */
const create = async invoice => {
  const paymentData = await new PaymentModel({
    provider: invoice.nameProvider,
    datePayment: invoice.payment.datePayment,
    type: invoice.payment.type,
    invoices: [invoice._id],
    nOrder: invoice.nOrder,
  });

  paymentData.save();
};

module.exports = {
  create,
};
