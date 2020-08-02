/* eslint-disable max-classes-per-file */

class MissingParamsError extends Error {
  constructor(msg = 'Faltan campos') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class ParamNotValidError extends Error {
  constructor(msg = 'Algunos campos no son válidos') {
    super(msg);
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
