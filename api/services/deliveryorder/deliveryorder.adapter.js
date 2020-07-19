class DeliveryOrderAdapter {
  constructor({
    _id, provider, nameProvider, products, iva, re, total, date, taxBase, rate,
  }) {
    this._id = _id;
    this.provider = provider;
    this.nameProvider = nameProvider;
    this.products = products;
    this.iva = iva;
    this.re = re;
    this.total = total;
    this.date = date;
    this.taxBase = taxBase;
    this.rate = rate;
  }

  /**
   * Create object with totals
   * @return {{total: Number, re: Number, iva: Number}}
   * @private
   */
  _generateTotals() {
    const {
      iva, re, total, taxBase, rate,
    } = this;
    return {
      iva,
      re,
      total,
      taxBase,
      rate,
    };
  }

  /**
   * Create JSON for response of create
   * @return {
   * {date: *, provider: *, _id: *, totals:
   * {total: Number, re: Number, iva: Number},
   * nameProvider: *, products: *}}
   */
  standardResponse() {
    const {
      _id, provider, nameProvider, products, date,
    } = this;
    return {
      _id,
      provider,
      nameProvider,
      date,
      products,
      totals: this._generateTotals(),
    };
  }

  /**
   * Create JSON for response for basic data
   * @return {{date: *, nameProvider: *}}
   */
  basicResponse() {
    const {
      _id, date,
    } = this;
    return {
      _id,
      date,
    };
  }

  /**
   * Create JSON response with products and totals
   * @return {{totals: {total: Number, re: Number, iva: Number}, products: *}}
   */
  productsResponse() {
    const {
      products,
    } = this;
    return {
      products,
      totals: this._generateTotals(),
    };
  }
}

module.exports = DeliveryOrderAdapter;
