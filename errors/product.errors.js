class ProductMissingParams extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Faltan campos del producto') {
    super(msg);
    this.name = this.constructor.name;
    this.code = 400;
  }
}

module.exports = {
  ProductMissingParams,
};
