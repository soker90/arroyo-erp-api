const payments = require('./payments');
const invoices = require('./invoices');

module.exports = {
  ...payments,
  ...invoices,
};
