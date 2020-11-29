const BillingErrors = require('./billing.errors');

describe('BillingErrors', () => {
  test('should be an object', () => {
    expect(BillingErrors)
      .toBeInstanceOf(Object);
  });

  describe('BillingErrors', () => {
    test('should exist and extend from Error', () => {
      expect(new BillingErrors.BillingYearMissing())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new BillingErrors.BillingYearMissing();
      expect(err.message)
        .toEqual('No se ha indicado el año');
    });

    test('should allow passing a custom message', () => {
      const err = new BillingErrors.BillingYearMissing('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });
});
