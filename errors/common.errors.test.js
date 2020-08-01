const CommonErrors = require('./common-errors');

describe('CommonErrors', () => {
  test('should be an object', () => {
    expect(CommonErrors).toBeInstanceOf(Object);
  });

  describe('DateNotValid', () => {
    test('should exist and extend from Error', () => {
      expect(new CommonErrors.DateNotValid()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new CommonErrors.DateNotValid();
      expect(err.message).toEqual('La fecha no es válida');
    });

    test('should allow passing a custom message', () => {
      const err = new CommonErrors.DateNotValid('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });
});
