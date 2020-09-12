const { DeliveryOrderModel, ProviderModel } = require('arroyo-erp-models');
const { deliveryOrderErrors } = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
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

/**
 * Valida los parametros para añadir o modificar un producto
 * @param quantity
 * @param product
 * @param price
 * @returns {Promise<void>}
 */
const validateProductParams = async ({ body: { quantity, product, price } }) => {
  if (!quantity || !product || typeof price !== 'number') throw new deliveryOrderErrors.DeliveryOrderMissing();
};

/**
 * Comprueba que existe el índice del producto en el albarán
 * @param {string} id
 * @param {number} index
 * @returns {Promise<void>}
 */
const validateProductIndex = async ({ id, index }) => {
  if (index < 0) throw new deliveryOrderErrors.DeliveryOrderProductIndexNotFound();
  const { products } = await DeliveryOrderModel.findOne({ _id: id });

  if (index >= products.length) throw new deliveryOrderErrors.DeliveryOrderProductIndexNotFound();
};

const validateProductIndexParams = ({ params }) => validateProductIndex(params);

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const hasDate = async ({ params: { id } }) => {
  const deliveryOrder = await DeliveryOrderModel.findOne({ _id: id });
  if (!deliveryOrder.date) throw new deliveryOrderErrors.DeliveryOrderDateRequired();
};

module.exports = {
  validateId,
  validateIdParam,
  validateProvider,
  validateProductParams,
  validateProductIndex,
  validateProductIndexParams,
  hasDate,
};
