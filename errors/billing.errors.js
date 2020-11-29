/* eslint-disable max-classes-per-file */

class BillingYearMissing extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'No se ha indicado el año') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  BillingYearMissing,
};
