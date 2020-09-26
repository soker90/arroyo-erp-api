const { ProviderModel } = require('arroyo-erp-models');

const provider = require('./services/provider');
const { TYPES_STANDARD_PROVIDER } = require('../../../constants');

/**
 * Return all providers
 * @return {Promise<{data: any}>}
 */
const providers = ({ name, type }) => {
  const filter = {
    ...(name && { name: { $regex: name } }),
    type: type === 'standard' ? TYPES_STANDARD_PROVIDER : type,
  };

  return ProviderModel.find(filter, 'name _id note')
    .collation({ locale: 'es' })
    .sort({ name: 1 })
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
