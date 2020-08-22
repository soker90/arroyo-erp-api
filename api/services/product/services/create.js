/* eslint-disable nonblock-statement-body-position */
const { ProductModel, ProviderModel } = require('arroyo-erp-models');

/**
 * Create product
 * @return {Promise<string>}
 */
const create = async product => {
  const {
    code, name, rate, iva, re, provider,
  } = product;

  const providerData = await ProviderModel.findOne({ _id: provider });

  await new ProductModel({
    code,
    name,
    ...(rate && { rate }),
    iva,
    re,
    ...(provider && { provider }),
    nameProvider: providerData.name,
  }).save();
};

module.exports = create;
