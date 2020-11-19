const ClientErrors = require('./client.errors');

describe('ClientErrors', () => {
  test('should be an object', () => {
    expect(ClientErrors).toBeInstanceOf(Object);
  });

  describe('ProviderMissingName', () => {
    test('should exist and extend from Error', () => {
      expect(new ClientErrors.ClientMissingName()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new ClientErrors.ClientMissingName();
      expect(err.message).toEqual('El nombre es obligatorio');
    });

    test('should allow passing a custom message', () => {
      const err = new ClientErrors.ClientMissingName('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });

  describe('ClientIdNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new ClientErrors.ClientIdNotFound()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new ClientErrors.ClientIdNotFound();
      expect(err.message).toEqual('No existe el cliente');
    });

    test('should allow passing a custom message', () => {
      const err = new ClientErrors.ClientIdNotFound('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });
});
