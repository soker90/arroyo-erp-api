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

class InvoiceParamsMissing extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Faltan campos') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class InvoiceWithOrderNumber extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'La factura ya tiene número de orden') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class InvoiceNoRemovable extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'La factura no puede ser eliminada') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class PaymentMerged extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'El pago está fusionado con otra factura') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class InvoiceExist extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'El número de factura ya existe') {
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
  InvoiceParamsMissing,
  InvoiceWithOrderNumber,
  InvoiceNoRemovable,
  PaymentMerged,
  InvoiceExist,
};
