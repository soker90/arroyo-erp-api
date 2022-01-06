const carbone = require('carbone');
const {
  ClientModel,
} = require('arroyo-erp-models');
const { orderByProvider } = require('../../billing/utils');

const initBillingData = client => ({
  name: client.name,
  nombre: client.businessName,
  cif: client.cif,
  cp: client.postalCode,
  poblacion: client.city,
  provincia: client.province,
  trimestre1: 0,
  trimestre2: 0,
  trimestre3: 0,
  trimestre4: 0,
  anual: 0,
});

const billingAdapter = (billingData, clients) => {
  const billing = {};
  billingData.forEach(clientTrimester => {
    const clientId = clientTrimester._id.client;
    const { trimester } = clientTrimester._id;
    if (!billing[clientId]) {
      const client = clients.find(({ _id }) => _id.toString() === clientId);
      billing[clientId] = initBillingData(client);
    }

    billing[clientId][`trimestre${trimester}`] = clientTrimester.sum;

    billing[clientId].anual += clientTrimester.sum;
  });

  return Object.values(billing)
    .sort(orderByProvider);
};

const exportOds = async ({
  short,
}, billing) => {
  const clients = await ClientModel.find({});

  const billingAdapted = billingAdapter(billing, clients);
  const billingFiltered = short ? billingAdapted.filter(({ anual }) => anual > 3005.06) : billingAdapted;

  let billingFile = null;
  let error = null;

  carbone.render('./templates/347-clientes.ods', billingFiltered, {
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
