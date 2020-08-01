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

class DateNotValid extends Error {
  constructor(msg = 'La fecha no es válida') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  MissingParamsError,
  ParamNotValidError,
  DateNotValid,
};
