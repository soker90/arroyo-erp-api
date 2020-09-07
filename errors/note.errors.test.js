const NoteErrors = require('./note.errors');

describe('NoteErrors', () => {
  test('should be an object', () => {
    expect(NoteErrors)
      .toBeInstanceOf(Object);
  });

  describe('NoteIdNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new NoteErrors.NoteIdNotFound())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new NoteErrors.NoteIdNotFound();
      expect(err.message)
        .toEqual('No existe la nota');
    });

    test('should allow passing a custom message', () => {
      const err = new NoteErrors.NoteIdNotFound('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });
});
