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

module.exports = {
  roundNumber,
};
