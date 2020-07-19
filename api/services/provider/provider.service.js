const { ProviderModel, BillingModel } = require('arroyo-erp-models');
const { ProviderMissingName, ProviderMissingId } = require('../../../errors/provider.errors');
const { billingAdapter, noBillingData } = require('./provider.adapter');

/**
 * Validate params
 * @param {string} name
 * @param {string} address
 * @param {String} city
 * @param {string} postalCode
 * @param {string} province
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
  city,
  postalCode,
  province,
  phone,
  email,
  businessName,
  cif,
}) => {
  if (!name) throw new ProviderMissingName();
  return {
    name,
    city,
    postalCode,
    province,
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

  console.log(data);
  const billing = await BillingModel.findOne({
    provider: id,
    year: new Date().getFullYear(),
  })
    .then(billingAdapter)
    .catch(noBillingData);

  return {
    provider: data,
    billing,
  };
};

module.exports = {
  providers,
  create,
  update,
  provider,
};
