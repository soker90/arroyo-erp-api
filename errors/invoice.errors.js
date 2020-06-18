class InvoiceMissingDeliveryOrders extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'No se han enviado albaranes') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class InvoiceNotFoundDeliveryOrder extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Alguno de los albaranes no existe') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  InvoiceMissingDeliveryOrders,
  InvoiceNotFoundDeliveryOrder,
};
