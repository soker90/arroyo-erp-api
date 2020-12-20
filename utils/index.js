const roundNumber = require('./roundNumber');
const payments = require('./payment');

/**
 * Genera un nuevo array con el elemento del índice dado reemplazado
 * @param {Array} array
 * @param {any} element
 * @param {number} index
 * @returns {Array}
 */
const replaceArrayElement = ({ array, element, index }) => {
  const newArray = array.slice();
  newArray[index] = element;
  return newArray;
};

/**
 * Devulve si el objecto está vacío
 * @param {Object} obj
 * @returns {boolean}
 */
const isEmptyObject = obj => !Object.keys(obj).length;

const isNumber = num => typeof num === 'number';

const formatDate = date => new Date(date).toLocaleDateString('es-ES');

/**
 *
 * @param cell
 * @return {string}
 */
const formatNumber = cell => {
  const num = new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    maximumFractionDigits: 2,
  });
  return num.format(cell);
};

module.exports = {
  roundNumber,
  replaceArrayElement,
  isEmptyObject,
  isNumber,
  formatDate,
  formatNumber,
  ...payments,
};
