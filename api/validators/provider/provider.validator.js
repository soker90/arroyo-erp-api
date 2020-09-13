const { ProviderModel } = require('arroyo-erp-models');
const { providerErrors, commonErrors } = require('../../../errors');
const { isEmptyObject } = require('../../../utils');

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
const validateProviderIfExist = data => data?.provider && _checkId(data.provider);
const validateProvider = ({ provider }) => provider && _checkId(provider);

/**
 * Compruba que solo reciba campos válidos y que reciba nombre
 * @param {string} name
 * @param {string} address
 * @param {string} city
 * @param {Object} others
 */
const fieldsValid = ({
  name, address, city, postalCode, province, phone, email, businessName, cif,
  _id, note, ...others
}) => {
  if (!name) throw new providerErrors.ProviderMissingName();
  if (!isEmptyObject(others)) throw new commonErrors.ParamNotValidError();
};
const fieldsValidBody = ({ body }) => fieldsValid(body);

module.exports = {
  validateIdParam,
  validateId,
  validateProviderIfExist,
  validateProvider,
  fieldsValid,
  fieldsValidBody,
};
