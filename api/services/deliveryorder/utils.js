/**
 * Get timestamp of yesterday in seconds
 * @return {number}
 */
const yesterdayDate = () => Math.trunc((Date.now() - 86400000) / 1000);

module.exports = {
  yesterdayDate,
};
