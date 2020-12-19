const ReminderErrors = require('./reminder.errors');

describe('ReminderErrors', () => {
  test('should be an object', () => {
    expect(ReminderErrors)
      .toBeInstanceOf(Object);
  });

  describe('NoteIdNotFound', () => {
    test('should exist and extend from Error', () => {
      expect(new ReminderErrors.ReminderIdNotFound())
        .toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new ReminderErrors.ReminderIdNotFound();
      expect(err.message)
        .toEqual('No existe el recordatorio');
    });

    test('should allow passing a custom message', () => {
      const err = new ReminderErrors.ReminderIdNotFound('CustomMessage');
      expect(err.message)
        .toEqual('CustomMessage');
    });
  });
});
