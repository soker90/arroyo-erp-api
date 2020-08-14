const { ProviderModel } = require('arroyo-erp-models');
const { providerErrors } = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const providerExist = await ProviderModel.exists({ _id: id });
  if (!providerExist) throw new providerErrors.ProviderIdNotFound();
};

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);

module.exports = {
  validateIdParam,
  validateId,
};
