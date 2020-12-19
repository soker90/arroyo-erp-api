/* eslint-disable max-classes-per-file */

class ReminderIdNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'No existe el recordatorio') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  ReminderIdNotFound,
};
