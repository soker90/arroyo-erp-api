const CommonErrors = require('./common-errors');

describe('CommonErrors', () => {
  test('should be an object', () => {
    expect(CommonErrors).toBeInstanceOf(Object);
  });

  describe('MissingParamsError', () => {
    test('should exist and extend from Error', () => {
      expect(new CommonErrors.MissingParamsError()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new CommonErrors.MissingParamsError();
      expect(err.message).toEqual('Faltan campos');
    });

    test('should allow passing a custom message', () => {
      const err = new CommonErrors.MissingParamsError('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });

  describe('ParamNotValidError', () => {
    test('should exist and extend from Error', () => {
      expect(new CommonErrors.ParamNotValidError()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new CommonErrors.ParamNotValidError();
      expect(err.message).toEqual('Algunos campos no son válidos');
    });

    test('should allow passing a custom message', () => {
      const err = new CommonErrors.ParamNotValidError('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
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
