const { TYPE_PAYMENT } = require('../constants/payments');
/**
 * Devuelve si el tipo de pago es efectivo
 * @param {String} type
 * @returns {boolean}
 */
const isTypeCash = type => type === TYPE_PAYMENT.CASH;

module.exports = {
  isTypeCash,
};
