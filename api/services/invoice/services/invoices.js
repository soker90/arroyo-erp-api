const { InvoiceModel } = require('arroyo-erp-models');
const { COLUMNS_INVOICES } = require('../../../../constants/invoices');

/**
 * Get all invoices
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoices = async ({
  offset,
  limit,
  year,
  dateInvoice,
  total,
  nInvoice,
  numCheque,
  nameProvider,
  expenses,
}) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  const searchParams = {
    ...(dateInvoice && { dateInvoice }),
    ...(total && { total }),
    ...(nInvoice && { nInvoice }),
    ...(numCheque && { 'payment.numCheque': numCheque }),
    ...(nameProvider && { nameProvider }),
    ...(expenses && {
      bookColumn: {
        $ne: COLUMNS_INVOICES.COMPRAS,
      },
    }),
    dateRegister: {
      $gte: start,
      $lt: end,
    },
  };

  const count = await InvoiceModel.countDocuments(searchParams);

  const invoicesList = await InvoiceModel.find(searchParams, '_id businessName nOrder dateInvoice total dateRegister dateInvoice nInvoice concept')
    .sort({ nOrder: -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit || 100))
    .lean();

  return {
    invoices: invoicesList,
    count,
  };
};

module.exports = invoices;
