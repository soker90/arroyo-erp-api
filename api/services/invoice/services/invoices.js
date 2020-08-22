const { InvoiceModel } = require('arroyo-erp-models');

/**
 * Get all invoices
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoices = ({ offset, limit, year }) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return InvoiceModel.find({
    dateRegister: {
      $gte: start,
      $lt: end,
    },
  }, '_id nameProvider nOrder dateInvoice total dateRegister dateInvoice nInvoice concept')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();
};

module.exports = invoices;
