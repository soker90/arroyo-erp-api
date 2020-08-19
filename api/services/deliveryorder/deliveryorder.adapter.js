class DeliveryOrderAdapter {
  constructor({
    _id, provider, nameProvider, products, iva, re, total, date, taxBase, rate, invoice, nOrder,
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
    this.nOrder = nOrder;
    this.invoice = invoice;
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
