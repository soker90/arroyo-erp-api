const { ClientModel } = require('arroyo-erp-models');
const { clientErrors, commonErrors } = require('../../../errors');
const { isEmptyObject } = require('../../../utils');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const clientExist = await ClientModel.exists({ _id: id });
  if (!clientExist) throw new clientErrors.ClientIdNotFound();
};

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);
const validateClient = ({ client }) => _checkId(client);

/**
 * Compruba que solo reciba campos válidos y que reciba nombre
 * @param {string} name
 * @param {string} address
 * @param {string} city
 * @param {string} type
 * @param {Object} others
 * @param {Boolean} noHaveType - Indica si puede incluir type
 */
const fieldsValid = ({
  name, address, city, postalCode, province, phone, email, businessName, cif,
  _id, ...others
}) => {
  if (!name) throw new clientErrors.ClientMissingName();
  if (!isEmptyObject(others)) throw new commonErrors.ParamNotValidError();
};
const fieldsValidBody = ({ body }) => fieldsValid(body);

module.exports = {
  fieldsValid,
  fieldsValidBody,
  validateIdParam,
  validateId,
  validateClient
};
