/**
 * Round number to 2 decimals
 * @param {number} num
 * @param {number} decimals
 * @returns {number}
 */
const roundNumber = (num, decimals = 2) => {
  const baseDecimals = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * baseDecimals) / baseDecimals;
};

module.exports = {
  roundNumber,
};
