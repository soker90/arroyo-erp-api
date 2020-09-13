/* eslint-disable nonblock-statement-body-position */
const { PaymentModel } = require('arroyo-erp-models');
const Promise = require('bluebird');

const LogService = require('../log.service');

const TYPE = 'PaymentService';

const logService = new LogService(TYPE);

const merge = require('./services/merge');
const confirm = require('./services/confirm');

/**
 * Create payment
 * @return {Promise<string>}
 */
const create = async invoice => {
  if (!invoice.payment.paid) {
    logService.logInfo(`[create payment] - Creando pago para ${invoice._id}`);
    const paymentData = await new PaymentModel({
      provider: invoice.nameProvider,
      paymentDate: invoice.payment.paymentDate,
      type: invoice.payment.type,
      invoices: [invoice._id],
      nOrder: invoice.nOrder,
      amount: invoice.total,
      invoiceDate: invoice.dateInvoice,
      nInvoice: invoice.nInvoice,
    });

    paymentData.save();
  } else
    logService.logInfo(`[create payment] - La factura ${invoice._id} ya está pagada`);
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
      PaymentModel.findOneAndUpdate({ _id: payment }, { merged: false })
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
