const carbone = require('carbone');
const {
  BillingModel,
  ProviderModel,
} = require('arroyo-erp-models');

const { orderByProvider } = require('../utils');

const _invoicesAdapter = billings => billings.map(({
  provider,
  trimesters,
  annual,
}) => ({
  name: provider.name,
  nombre: provider.businessName,
  cif: provider.cif,
  cp: provider.postalCode,
  poblacion: provider.city,
  provincia: provider.province,
  trimestre1: trimesters[0],
  trimestre2: trimesters[1],
  trimestre3: trimesters[2],
  trimestre4: trimesters[3],
  anual: annual,
}));

const _getBilling = async (year, short) => {
  const invoices = await BillingModel.find({
    year,
    ...(short && { annual: { $gte: 3004.99 } }),
  }, 'trimesters provider annual')
    .populate('provider', 'businessName cif postalCode city province name', ProviderModel);

  return _invoicesAdapter(invoices)
    .sort(orderByProvider);
};

const exportOds = async ({
  year,
  short,
}) => {
  const billing = await _getBilling(year, short);

  let billingFile = null;
  let error = null;

  carbone.render('./templates/347.ods', billing, {
    lang: 'es-es',
  }, (err, result) => {
    /* istanbul ignore next */
    if (err) {
      error = err;
      return;
    }
    billingFile = result;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      /* istanbul ignore next */
      if (error) reject(error);
      /* istanbul ignore next */
      if (billingFile) resolve(billingFile);
    }, 1000);
  });
};

module.exports = exportOds;
