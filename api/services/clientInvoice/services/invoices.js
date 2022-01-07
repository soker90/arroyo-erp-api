const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Get all client invoices
 * @param {String} year
 * @returns {Promise<*>}
 */
const invoices = ({
  year,
}) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return ClientInvoiceModel.find({
    date: {
      $gte: start,
      $lt: end,
    },
    nInvoice: { $exists: true },
  }, '_id nameClient total date nInvoice paymentType paymentDate paid')
    .sort({ nInvoice: -1 })
    .lean();
};

module.exports = invoices;
