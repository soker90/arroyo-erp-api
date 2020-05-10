class ProviderMissingName extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'El nombre es obligatorio') {
    super(msg);
    this.name = this.constructor.name;
    this.code = 400;
  }
}

class ProviderMissingId extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Falta el id del proveedor') {
    super(msg);
    this.name = this.constructor.name;
    this.code = 400;
  }
}

module.exports = {
  ProviderMissingName,
  ProviderMissingId,
};
