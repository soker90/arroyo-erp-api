/* eslint-disable max-classes-per-file */

class MissingParamsError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ParamNotValidError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

module.exports = {
  MissingParamsError,
  ParamNotValidError,
};
