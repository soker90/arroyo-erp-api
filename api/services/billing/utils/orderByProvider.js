/**
 * Ordena alfabeticamente
 * @param {Object} a
 * @param {Object} b
 * @return number
 * @private
 */
const orderByProvider = (a, b) => a.name?.toLowerCase?.()
  ?.localeCompare?.(b?.name?.toLowerCase?.());

module.exports = orderByProvider;
