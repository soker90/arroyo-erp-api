const { DeliveryOrderModel, ProviderModel } = require('arroyo-erp-models');
const { INITIAL_SCHEMA } = require('../constants');

/**
 * Create product
 * @param {string} provider
 */
const create = async ({ provider }) => {
  const { name, hasCanal } = await ProviderModel.findOne({ _id: provider });

  const data = {
    provider,
    nameProvider: name,
    ...(hasCanal && { hasCanal }),
    ...INITIAL_SCHEMA,
  };

  return new DeliveryOrderModel(data).save();
};

module.exports = create;
