// eslint-disable-next-line max-classes-per-file
class ClientMissingName extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'El nombre es obligatorio') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class ClientIdNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'No existe el cliente') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  ClientMissingName,
  ClientIdNotFound,
};
