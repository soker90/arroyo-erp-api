/**
 * An error launched when there are missing params
 * @extends Error
 */
class MissingParamsError extends Error {
  constructor(msg = 'Faltan campos') {
    super(msg);
    this.code = 422;
    this.name = this.constructor.name;
  }
}

/**
 * An error launched when there are not valid params
 * @extends Error
 */
class NotValidParamsError extends Error {
  constructor(msg = 'Algunos campos no son válidos') {
    super(msg);
    this.code = 422;
    this.name = this.constructor.name;
  }
}

module.exports = {
  MissingParamsError,
  NotValidParamsError,
};
