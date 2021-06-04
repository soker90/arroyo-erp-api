const { InvoiceModel } = require('arroyo-erp-models');

/**
 * Get all invoices
 * @param {Object} params
 * @returns {Promise<*>}
 */
const cheques = async ({
  offset,
  limit,
  year,
}) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  const searchParams = {
    dateInvoice: {
      $gte: start,
      $lt: end,
    },
    'payment.numCheque': { $exists: true },

  };

  const count = await InvoiceModel.countDocuments(searchParams);

  const chequesList = await InvoiceModel.find(searchParams, '_id nameProvider payment.paymentDate payment.numCheque nOrder total')
    .sort({ 'payment.numCheque': -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit || 100))
    .lean();

  return {
    cheques: chequesList,
    count,
  };
};

module.exports = cheques;
