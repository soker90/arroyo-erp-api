const { ProviderModel } = require('arroyo-erp-models');

const provider = require('./services/provider');

/**
 * Return all providers
 * @return {Promise<{data: any}>}
 */
const providers = ({ name }) => {
  const filter = {
    ...(name && { name: { $regex: name } }),
  };

  return ProviderModel.find(filter, 'name _id')
    .lean();
};

/**
 * Create product
 * @param {Object} data
 */
const create = data => new ProviderModel(data).save();

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = ({ params, body }) => (
  ProviderModel.findOneAndUpdate({ _id: params.id }, { $set: body })
);

module.exports = {
  providers,
  create,
  update,
  provider,
};
