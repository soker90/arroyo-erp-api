/**
 * Round number to 2 decimals
 * @param {number} num
 * @param {number} decimals
 * @returns {number}
 */
const roundNumber = (num, decimals = 3) => {
  // eslint-disable-next-line no-restricted-properties
  const baseDecimals = Math.pow(10, decimals);
  return Math.round(num * baseDecimals) / baseDecimals;
};

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

module.exports = {
  roundNumber,
  replaceArrayElement,
  isEmptyObject,
};
