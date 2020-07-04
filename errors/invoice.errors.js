/* eslint-disable max-classes-per-file */
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

class InvoiceMissingId extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Falta el id de la factura') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class InvoiceIdNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'No existe la factura') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class InvoiceInvalidDateInvoice extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Fecha de factura incorrecta') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  InvoiceMissingDeliveryOrders,
  InvoiceNotFoundDeliveryOrder,
  InvoiceMissingId,
  InvoiceIdNotFound,
  InvoiceInvalidDateInvoice,
};
