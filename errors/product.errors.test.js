const ProductErrors = require('./product.errors');

describe('ProductErrors', () => {
  test('should be an object', () => {
    expect(ProductErrors).toBeInstanceOf(Object);
  });

  describe('ProductMissingParams', () => {
    test('should exist and extend from Error', () => {
      expect(new ProductErrors.ProductMissingParams()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new ProductErrors.ProductMissingParams();
      expect(err.message).toEqual('Faltan campos del producto');
    });

    test('should allow passing a custom message', () => {
      const err = new ProductErrors.ProductMissingParams('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });
});
