/* eslint-disable no-restricted-properties */
const _calcRound = (num, decimals) => {
  let countDecimals = `${num}`.split('.')?.[1]?.length || 0;

  let returnedNumber = num;
  if (countDecimals > decimals) {
    if (countDecimals > 10) countDecimals = 10;
    const baseDecimals = 10 ** (countDecimals - 1);
    const roundedNum = Math.round((num + Number.EPSILON) * baseDecimals) / baseDecimals;

    returnedNumber = _calcRound(roundedNum, decimals);
  }

  return returnedNumber;
};

/**
 * Round number to 2 decimals
 * @param {number} num
 * @param {number} decimals
 * @returns {number}
 */
const roundNumber = (num, decimals = 2) => {
  const absoluteNumber = Math.abs(num);
  const roundedNum = _calcRound(absoluteNumber, decimals);
  return num < 0 ? roundedNum * -1 : roundedNum;
};

module.exports = roundNumber;
