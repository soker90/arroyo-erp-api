const { DeliveryOrderModel, ProviderModel } = require('arroyo-erp-models');
const { deliveryOrderErrors } = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  if (!id) throw new deliveryOrderErrors.DeliveryOrderMissing();
  const deliveryOrderExist = await DeliveryOrderModel.exists({ _id: id });
  if (!deliveryOrderExist) throw new deliveryOrderErrors.DeliveryOrderNotFound();
};

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);

/**
 * Valida si existe el proveedor
 * @param {String} provider
 * @returns {Promise<void>}
 */
const validateProvider = async ({ provider }) => {
  if (!provider) throw new deliveryOrderErrors.DeliveryOrderMissing();
  const providerExist = await ProviderModel.exists({ _id: provider });
  if (!providerExist) throw new deliveryOrderErrors.DeliveryOrderProviderNotFound();
};

module.exports = {
  validateId,
  validateIdParam,
  validateProvider,
};
