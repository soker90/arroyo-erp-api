const PriceChangeErrors = require('./price-change.errors');

describe('PriceChangeErrors', () => {
  test('should be an object', () => {
    expect(PriceChangeErrors).toBeInstanceOf(Object);
  });

  describe('ElementsNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new PriceChangeErrors.ElementsNotFound()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new PriceChangeErrors.ElementsNotFound();
      expect(err.message).toEqual('Alguno de los elementos seleccionados no existe');
    });

    test('should allow passing a custom message', () => {
      const err = new PriceChangeErrors.ElementsNotFound('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });

  describe('PriceChangeNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new PriceChangeErrors.PriceChangeNotFound()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new PriceChangeErrors.PriceChangeNotFound();
      expect(err.message).toEqual('La notificación no existe');
    });

    test('should allow passing a custom message', () => {
      const err = new PriceChangeErrors.PriceChangeNotFound('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });
});
