const { ProviderModel } = require('arroyo-erp-models');
const { ProviderMissingName, ProviderMissingId } = require('../../../errors/provider.errors');

/**
 * Validate params
 * @param {string} name
 * @param {string} address
 * @param {string} phone
 * @param {string} email
 * @return {Object}
 * @private
 */
const _validateParams = ({
  name,
  address,
  phone,
  email,
}) => {
  if (!name) throw new ProviderMissingName();
  return {
    name,
    address,
    phone,
    email,
  };
};

/**
 * Return all providers
 * @return {Promise<{data: any}>}
 */
const providers = async ({ name }) => {
  const filter = {
    ...(name && { name: { $regex: name } }),
  };

  const data = await ProviderModel.find(filter, 'name _id')
    .lean();
  return data;
};

/**
 * Create product
 * @param {string} name
 * @param {string} address
 * @param {string} phone
 * @param {string} email
 */
const create = async ({
  name,
  address,
  phone,
  email,
}) => {
  const data = _validateParams({
    name,
    address,
    phone,
    email,
  });

  await new ProviderModel(data).save();
};

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = async ({ params, body, ...rest }) => {
  if (!params.id) throw new ProviderMissingId();
  console.log(rest);

  const data = _validateParams(body);
  await ProviderModel.findOneAndUpdate({ _id: params.id }, { $set: data });
};

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const provider = async ({ id }) => {
  if (!id) throw new ProviderMissingId();

  const data = await ProviderModel.findOne({ _id: id })
    .lean();
  return { data };
};

module.exports = {
  providers,
  create,
  update,
  provider,
};
