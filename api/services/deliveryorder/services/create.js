const { DeliveryOrderModel, ProviderModel } = require('arroyo-erp-models');
const { INITIAL_SCHEMA } = require('../constants');

/**
 * Create product
 * @param {string} provider
 */
const create = async ({ provider }) => {
  const { name } = await ProviderModel.findOne({ _id: provider });

  const data = {
    provider,
    nameProvider: name,
    ...INITIAL_SCHEMA,
  };

  return new DeliveryOrderModel(data).save();
};

module.exports = create;
