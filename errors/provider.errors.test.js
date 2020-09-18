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

  describe('ProviderIdNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new ProviderErrors.ProviderIdNotFound()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new ProviderErrors.ProviderIdNotFound();
      expect(err.message).toEqual('No existe el proveedor');
    });

    test('should allow passing a custom message', () => {
      const err = new ProviderErrors.ProviderIdNotFound('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });

  describe('ProviderTypeNotValid', () => {
    test('should exist and extend from Error', () => {
      expect(new ProviderErrors.ProviderTypeNotValid()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new ProviderErrors.ProviderTypeNotValid();
      expect(err.message).toEqual('El tipo del proveedor no es válido');
    });

    test('should allow passing a custom message', () => {
      const err = new ProviderErrors.ProviderTypeNotValid('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });
});
