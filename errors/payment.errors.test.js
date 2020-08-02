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
});
