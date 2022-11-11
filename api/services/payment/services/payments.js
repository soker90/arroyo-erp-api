// TODO Ordenar conforme sea necesario
const { PaymentModel } = require('arroyo-erp-models');
/**
 *Devuelve todos los pagos no abonados
 * @returns {*}
 */
const payments = () => PaymentModel.find({
  paid: { $exists: false },
  $or: [{ merged: { $exists: false } }, { merged: false }],
});

module.exports = payments;
