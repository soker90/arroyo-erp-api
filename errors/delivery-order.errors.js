/* eslint-disable max-classes-per-file */
class DeliveryOrderMissingId extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Falta el id del albarán') {
    super(msg);
    this.name = this.constructor.name;
    this.code = 400;
  }
}

class DeliveryOrderMissing extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'Faltan parámetros') {
    super(msg);
    this.name = this.constructor.name;
    this.code = 400;
  }
}

class DeliveryOrderNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'El albarán no es válido') {
    super(msg);
    this.name = this.constructor.name;
    this.code = 422;
  }
}

class DeliveryOrderProviderNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'El proveedor no es válido') {
    super(msg);
    this.name = this.constructor.name;
    this.code = 422;
  }
}

class DeliveryOrderProductIndexNotFound extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'El indice de producto del albarán no existe') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class DeliveryOrderDateRequired extends Error {
  /**
   * Create an instance
   *
   * @param {string} [msg=user invalid login] Message for the error
   */
  constructor(msg = 'El albarán necesita una fecha') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  DeliveryOrderMissingId,
  DeliveryOrderMissing,
  DeliveryOrderProviderNotFound,
  DeliveryOrderNotFound,
  DeliveryOrderProductIndexNotFound,
  DeliveryOrderDateRequired,
};
