/* eslint-disable nonblock-statement-body-position */
const { ProductModel, ProviderModel } = require('arroyo-erp-models');

/**
 * Create product
 * @return {Promise<string>}
 */
const create = async ({
  code, name, rate, iva, re, provider, profit,
}) => {
  const providerData = await ProviderModel.findOne({ _id: provider });

  await new ProductModel({
    code,
    name,
    ...(rate && { rate }),
    iva,
    re,
    ...(profit && { profit }),
    ...(provider && { provider }),
    nameProvider: providerData.name,
  }).save();
};

module.exports = create;
