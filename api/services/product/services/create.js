/* eslint-disable nonblock-statement-body-position */
const { ProductModel, ProviderModel } = require('arroyo-erp-models');

/**
 * Create product
 * @return {Promise<string>}
 */
const create = async ({
  code, name, rate, iva, re, provider, sale,
}) => {
  const providerData = await ProviderModel.findOne({ _id: provider });

  await new ProductModel({
    code,
    name,
    ...(rate && { rate }),
    iva,
    re,
    sale,
    ...(provider && { provider }),
    nameProvider: providerData.name,
  }).save();
};

module.exports = create;
