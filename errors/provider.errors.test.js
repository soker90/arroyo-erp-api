const ProviderErrors = require('./provider.errors');

describe('ProviderErrors', () => {
  test('should be an object', () => {
    expect(ProviderErrors).toBeInstanceOf(Object);
  });

  describe('ProviderMissingName', () => {
    test('should exist and extend from Error', () => {
      expect(new ProviderErrors.ProviderMissingName()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new ProviderErrors.ProviderMissingName();
      expect(err.message).toEqual('El nombre es obligatorio');
    });

    test('should allow passing a custom message', () => {
      const err = new ProviderErrors.ProviderMissingName('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });

  describe('ProviderMissingId', () => {
    test('should exist and extend from Error', () => {
      expect(new ProviderErrors.ProviderMissingId()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new ProviderErrors.ProviderMissingId();
      expect(err.message).toEqual('Falta el id del proveedor');
    });

    test('should allow passing a custom message', () => {
      const err = new ProviderErrors.ProviderMissingId('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });
});
