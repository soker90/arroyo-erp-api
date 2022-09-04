const roundNumber = require('./roundNumber');
const payments = require('./payment');
const orderByName = require('./orderByName');

/**
 * Genera un nuevo array con el elemento del índice dado reemplazado
 * @param {Array} array
 * @param {any} element
 * @param {number} index
 * @returns {Array}
 */
const replaceArrayElement = ({
  array,
  element,
  index,
}) => {
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

const calcQuarter = month => parseInt((month - 1) / 3, 10) + 1;

// Datetime menos medio dia
const getTime = date => date.getTime() - 43200000;

module.exports = {
  roundNumber,
  replaceArrayElement,
  isEmptyObject,
  isNumber,
  formatDate,
  calcQuarter,
  getTime,
  ...payments,
  orderByName,
};
