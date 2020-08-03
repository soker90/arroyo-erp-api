/* eslint-disable max-classes-per-file */

class PaymentIdNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'No existe el pago') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class PaymentsMissing extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Debes seleccionar 2 o mas pagos') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  PaymentIdNotFound,
  PaymentsMissing,
};
