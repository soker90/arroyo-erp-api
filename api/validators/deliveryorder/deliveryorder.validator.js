const { DeliveryOrderModel, ProviderModel, ProductModel } = require('arroyo-erp-models');
const { deliveryOrderErrors, productErrors } = require('../../../errors');

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

/**
 * Valida los parametros para añadir o modificar un producto
 * @param quantity
 * @param product
 * @param price
 * @returns {Promise<void>}
 */
const validateProductParams = async ({ body: { quantity, product, price } }) => {
  if (!quantity || !product || !price) throw new deliveryOrderErrors.DeliveryOrderMissing();
  const productExist = ProductModel.exists({ _id: product });
  if (!productExist) throw new productErrors.ProductNotFound();
};

module.exports = {
  validateId,
  validateIdParam,
  validateProvider,
  validateProductParams,
};
