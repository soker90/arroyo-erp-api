const InvoiceErrors = require('./invoice.errors');

describe('InvoiceErrors', () => {
  test('should be an object', () => {
    expect(InvoiceErrors)
      .toBeInstanceOf(Object);
  });

  describe('InvoiceMissingDeliveryOrders', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceMissingDeliveryOrders())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceMissingDeliveryOrders();
      expect(err.message)
        .toEqual('No se han enviado albaranes');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceMissingDeliveryOrders('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('InvoiceNotFoundDeliveryOrder', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceNotFoundDeliveryOrder())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceNotFoundDeliveryOrder();
      expect(err.message)
        .toEqual('Alguno de los albaranes no existe');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceNotFoundDeliveryOrder('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });
  describe('InvoiceMissingId', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceMissingId())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceMissingId();
      expect(err.message)
        .toEqual('Falta el id de la factura');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceMissingId('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('InvoiceIdNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceIdNotFound())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceIdNotFound();
      expect(err.message)
        .toEqual('No existe la factura');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceIdNotFound('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('InvoiceParamsMissing', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceParamsMissing())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceParamsMissing();
      expect(err.message)
        .toEqual('Faltan campos');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceParamsMissing('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('InvoiceWithOrderNumber', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceWithOrderNumber())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceWithOrderNumber();
      expect(err.message)
        .toEqual('La factura ya tiene número de orden');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceWithOrderNumber('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('InvoiceNoRemovable', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceNoRemovable())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceNoRemovable();
      expect(err.message)
        .toEqual('La factura no puede ser eliminada');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceNoRemovable('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('PaymentMerged', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.PaymentMerged())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.PaymentMerged();
      expect(err.message)
        .toEqual('El pago está fusionado con otra factura');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.PaymentMerged('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });
});
