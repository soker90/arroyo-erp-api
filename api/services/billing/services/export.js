const carbone = require('carbone');
const { BillingModel, ProviderModel } = require('arroyo-erp-models');

const _invoicesAdapter = billings => billings.map(({ provider, trimesters, annual }) => ({
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

const _getBilling = async year => {
  const invoices = await BillingModel.find({
    year,
    annual: { $gte: 3004.99 },
  }, 'trimesters provider annual')
    .populate('provider', 'businessName cif postalCode city province', ProviderModel)
    .sort({ 'provider.name': 1 });

  return _invoicesAdapter(invoices);
};

const exportOds = async ({ year }) => {
  const billing = await _getBilling(year);

  let billingFile = null;
  let error = null;

  carbone.render('./templates/347.ods', billing, {
    lang: 'es-es',
  }, (err, result) => {
    if (err) {
      error = err;
      return;
    }
    billingFile = result;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) reject(error);
      if (billingFile) resolve(billingFile);
    }, 1000);
  });
};

module.exports = exportOds;
