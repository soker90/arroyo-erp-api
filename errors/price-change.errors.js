/* eslint-disable max-classes-per-file */

class ElementsNotFound extends Error {
  constructor(msg = 'Alguno de los elementos seleccionados no existe') {
    super(msg);
    this.name = this.constructor.name;
  }
}

class PriceChangeNotFound extends Error {
  constructor(msg = 'La notificación no existe') {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = {
  ElementsNotFound,
  PriceChangeNotFound,
};
