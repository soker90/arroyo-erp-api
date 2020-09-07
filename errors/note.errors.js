/* eslint-disable max-classes-per-file */

class NoteIdNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'No existe la nota') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  NoteIdNotFound,
};
