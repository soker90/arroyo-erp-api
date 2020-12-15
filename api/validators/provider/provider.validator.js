const { ProviderModel } = require('arroyo-erp-models');
const { providerErrors, commonErrors } = require('../../../errors');
const { isEmptyObject } = require('../../../utils');
const { TYPE_PROVIDER_LIST } = require('../../../constants');

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
 * @param {string} type
 * @param {boolean} hasCanal
 * @param {Object} others
 * @param {Boolean} noHaveType - Indica si puede incluir type
 */
const fieldsValid = ({
  name, address, city, postalCode, province, phone, email, businessName, cif,
  _id, note, type, hasCanal, ...others
}, noHaveType = false) => {
  if (!name) throw new providerErrors.ProviderMissingName();
  if (!isEmptyObject(others) || (noHaveType && type)) throw new commonErrors.ParamNotValidError();
};
const fieldsValidBody = ({ body }) => fieldsValid(body, true);

/**
 * Valida el tipo de proveedor
 * @param {string} type
 */
const validateType = ({ type }) => {
  if (!TYPE_PROVIDER_LIST.includes(type)) throw new providerErrors.ProviderTypeNotValid();
};

module.exports = {
  validateIdParam,
  validateId,
  validateProviderIfExist,
  validateProvider,
  fieldsValid,
  fieldsValidBody,
  validateType,
};
