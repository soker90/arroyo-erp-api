const PaymentErrors = require('./payment.errors');

describe('PaymentErrors', () => {
  test('should be an object', () => {
    expect(PaymentErrors)
      .toBeInstanceOf(Object);
  });

  describe('PaymentIdNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new PaymentErrors.PaymentIdNotFound())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new PaymentErrors.PaymentIdNotFound();
      expect(err.message)
        .toEqual('No existe el pago');
    });

    test('should allow passing a custom message', () => {
      const err = new PaymentErrors.PaymentIdNotFound('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('PaymentsMissings', () => {
    test('should exist and extend from Error', () => {
      expect(new PaymentErrors.PaymentsMissing())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new PaymentErrors.PaymentsMissing();
      expect(err.message)
        .toEqual('Debes seleccionar 2 o mas pagos');
    });

    test('should allow passing a custom message', () => {
      const err = new PaymentErrors.PaymentsMissing('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });

  describe('PaymentDivideNotMerged', () => {
    test('should exist and extend from Error', () => {
      expect(new PaymentErrors.PaymentDivideNotMerged())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new PaymentErrors.PaymentDivideNotMerged();
      expect(err.message)
        .toEqual('No puedes dividir un pago no fusionado');
    });

    test('should allow passing a custom message', () => {
      const err = new PaymentErrors.PaymentDivideNotMerged('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });
});
