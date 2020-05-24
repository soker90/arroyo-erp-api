class DeliveryOrderAdapter {
  constructor({
    _id, provider, nameProvider, products, selectedProducts, size, iva, re, total, date,
  }) {
    this._id = _id;
    this.provider = provider;
    this.nameProvider = nameProvider;
    this.products = products;
    this.selectedProducts = selectedProducts;
    this.size = size;
    this.iva = iva;
    this.re = re;
    this.total = total;
    this.date = date;
  }

  /**
   * Create object with totals
   * @return {{total: Number, re: Number, iva: Number}}
   * @private
   */
  _generateTotals() {
    const { iva, re, total } = this;
    return {
      iva,
      re,
      total,
    };
  }

  /**
   * Create JSON for response of create
   * @return {{date: *, provider: *, selectedProducts: *, _id: *, totals: {total: *, re: *, iva: *}, nameProvider: *, products: *}}
   */
  createResponse() {
    const {
      _id, provider, nameProvider, products, selectedProducts, date,
    } = this;
    return {
      _id,
      provider,
      nameProvider,
      date,
      selectedProducts,
      products,
      totals: this._generateTotals(),
    };
  }
}

module.exports = DeliveryOrderAdapter;
