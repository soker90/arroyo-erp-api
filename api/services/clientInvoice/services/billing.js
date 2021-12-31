const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Devuelve las facturas del cliente
 * @param {Object} params
 * @returns {Promise<*>}
 */
const billing = ({
  year,
}) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return ClientInvoiceModel.aggregate(
    [
      {
        $match: {
          nInvoice: { $exists: true },
          date: {
            $gte: start.getTime() - 43200000,
            $lt: end.getTime() - 43200000,
          },
        },
      },
      {
        $group:
          {
            _id: {
              month: { $month: { $toDate: '$date' } }, year: { $year: { $toDate: '$date' } }, client: '$client', name: '$nameClient',
            },
            sum: { $sum: '$total' },
          },
      },

    ]
  );
};
module.exports = billing;
