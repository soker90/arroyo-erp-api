const DeliveryOrderErrors = require('./delivery-order.errors');

describe('DeliveryOrderErrors', () => {
  test('should be an object', () => {
    expect(DeliveryOrderErrors)
      .toBeInstanceOf(Object);
  });

  describe('DeliveryOrderMissingId', () => {
    test('should exist and extend from Error', () => {
      expect(new DeliveryOrderErrors.DeliveryOrderMissingId())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderMissingId();
      expect(err.message)
        .toEqual('Falta el id del albarán');
    });

    test('should allow passing a custom message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderMissingId('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('DeliveryOrderMissing', () => {
    test('should exist and extend from Error', () => {
      expect(new DeliveryOrderErrors.DeliveryOrderMissing())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderMissing();
      expect(err.message)
        .toEqual('Faltan parámetros');
    });

    test('should allow passing a custom message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderMissing('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('DeliveryOrderNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new DeliveryOrderErrors.DeliveryOrderNotFound())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderNotFound();
      expect(err.message)
        .toEqual('El albarán no es válido');
    });

    test('should allow passing a custom message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderNotFound('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('DeliveryOrderProviderNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new DeliveryOrderErrors.DeliveryOrderProviderNotFound())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderProviderNotFound();
      expect(err.message)
        .toEqual('El proveedor no es válido');
    });

    test('should allow passing a custom message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderProviderNotFound('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('DeliveryOrderProductIndexNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new DeliveryOrderErrors.DeliveryOrderProductIndexNotFound())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderProductIndexNotFound();
      expect(err.message)
        .toEqual('El indice de producto del albarán no existe');
    });

    test('should allow passing a custom message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderProductIndexNotFound('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('DeliveryOrderDateRequired', () => {
    test('should exist and extend from Error', () => {
      expect(new DeliveryOrderErrors.DeliveryOrderDateRequired())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderDateRequired();
      expect(err.message)
        .toEqual('El albarán necesita una fecha');
    });

    test('should allow passing a custom message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderDateRequired('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('DeliveryOrderDeleteWithInvoice', () => {
    test('should exist and extend from Error', () => {
      expect(new DeliveryOrderErrors.DeliveryOrderDeleteWithInvoice())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderDeleteWithInvoice();
      expect(err.message)
        .toEqual('El albarán está incluido en una factura, no puede eliminarse');
    });

    test('should allow passing a custom message', () => {
      const err = new DeliveryOrderErrors.DeliveryOrderDeleteWithInvoice('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });
});
