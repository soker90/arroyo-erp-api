/**
 * Round number to 2 decimals
 * @param {number} num
 * @param {number} decimals
 * @returns {number}
 */
const roundNumber = (num, decimals = 3) => {
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
const replaceArrayElement = ({ array, element, index }) => (
  Object.assign(
    [],
    array,
    { [index]: element },
  )
);
module.exports = {
  roundNumber,
  replaceArrayElement,
};
