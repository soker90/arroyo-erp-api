const errorHandlers = require('.');

const message = 'Test error';

function _getMockResponse() {
  return {
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    send(payload) {
      this.payload = payload;
    },
  };
}

describe('Error handlers', () => {
  describe('sendError', () => {
    const mockRes = _getMockResponse();

    beforeAll(() => {
      errorHandlers.sendError(mockRes)(message);
    });

    test('It should contain an statusCode of 400', () => {
      expect(mockRes.statusCode).toBe(400);
    });

    test('It should contain a payload with an error message', () => {
      expect(mockRes.payload.error).toBe('Bad Request');
      expect(mockRes.payload.message).toBe('Bad Request');
    });
  });

  describe('sendResourceFailedError', () => {
    const mockRes = _getMockResponse();

    beforeAll(() => {
      errorHandlers.sendResourceFailedError(mockRes)(message);
    });

    test('It should contain an statusCode of 424', () => {
      expect(mockRes.statusCode).toBe(424);
    });

    test('It should contain a payload with an error message', () => {
      expect(mockRes.payload.error).toBe('Failed Dependency');
      expect(mockRes.payload.message).toBe('Failed Dependency');
    });
  });

  describe('sendValidationError', () => {
    const mockRes = _getMockResponse();

    beforeAll(() => {
      errorHandlers.sendValidationError(mockRes)(message);
    });

    test('It should contain an statusCode of 422', () => {
      expect(mockRes.statusCode).toBe(422);
    });

    test('It should contain a payload with an error message', () => {
      expect(mockRes.payload.error).toBe('Unprocessable Entity');
      expect(mockRes.payload.message).toBe('Unprocessable Entity');
    });
  });
});
