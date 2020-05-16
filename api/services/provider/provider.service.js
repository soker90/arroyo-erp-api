const { ProviderModel } = require('arroyo-erp-models');
const { ProviderMissingName, ProviderMissingId } = require('../../../errors/provider.errors');

/**
 * Validate params
 * @param {string} name
 * @param {string} address
 * @param {string} phone
 * @param {string} email
 * @param {string} businessName
 * @param {string} cif
 * @return {Object}
 * @private
 */
const _validateParams = ({
  name,
  address,
  phone,
  email,
  businessName,
  cif,
}) => {
  if (!name) throw new ProviderMissingName();
  return {
    name,
    address,
    phone,
    email,
    businessName,
    cif,
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
 * @param {Object} receivedData
 */
const create = async receivedData => {
  const data = _validateParams(receivedData);

  await new ProviderModel(data).save();
};

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = async ({ params, body }) => {
  if (!params.id) throw new ProviderMissingId();

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
