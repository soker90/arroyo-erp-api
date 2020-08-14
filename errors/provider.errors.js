// eslint-disable-next-line max-classes-per-file
class ProviderMissingName extends Error {
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

class ProviderIdNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'No existe el proveedor') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  ProviderMissingName,
  ProviderIdNotFound,
};
