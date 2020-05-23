/**
 * Get timestamp of yesterday in ms
 * @return {number}
 */
const yesterdayDate = () => Math.trunc(Date.now() - 86400000);

module.exports = {
  yesterdayDate,
};
