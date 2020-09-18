const payments = require('./payments');
const invoices = require('./invoices');
const providers = require('./providers');

module.exports = {
  ...payments,
  ...invoices,
  ...providers,
};
