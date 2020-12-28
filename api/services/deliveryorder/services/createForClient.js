const {
  DeliveryOrderModel,
  ClientModel,
} = require('arroyo-erp-models');

/**
 * Create delivery order
 * @param {string} provider
 * @param {string} client
 */
const create = async ({
  client,
}) => {
  const { name } = await ClientModel.findOne({ _id: client });

  const data = {
    client,
    name,
    date: null,
    products: [],
    total: 0,
  };

  return new DeliveryOrderModel(data).save();
};

module.exports = create;
