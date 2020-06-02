class DeliveryOrderAdapter {
  constructor({
    _id, provider, nameProvider, products, size, iva, re, total, date, taxBase,
  }) {
    this._id = _id;
    this.provider = provider;
    this.nameProvider = nameProvider;
    this.products = products;
    this.size = size;
    this.iva = iva;
    this.re = re;
    this.total = total;
    this.date = date;
    this.taxBase = taxBase;
  }

  /**
   * Create object with totals
   * @return {{total: Number, re: Number, iva: Number}}
   * @private
   */
  _generateTotals() {
    const {
      iva, re, total, taxBase,
    } = this;
    return {
      iva,
      re,
      total,
      taxBase,
    };
  }

  /**
   * Create JSON for response of create
   * @return {{date: *, provider: *, selectedProducts: *, _id: *, hasRate: boolean,
   * totals: {total: *, re: *, iva: *}, nameProvider: *, products: *}}
   */
  standardResponse() {
    const {
      _id, provider, nameProvider, products, date, hasRate,
    } = this;
    return {
      _id,
      provider,
      nameProvider,
      date,
      products,
      hasRate,
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
