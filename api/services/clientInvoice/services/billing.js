const { ClientInvoiceModel } = require('arroyo-erp-models');
const { getTime } = require('../../../../utils');

const _generateCase = (tStart, tEnd, nTrimestre) => ({
  case: {
    $and: [{ $gte: ['$date', getTime(tStart)] },
      { $lt: ['$date', getTime(tEnd)] }],
  },
  then: nTrimestre,
});

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
  const trimester2 = new Date(year, 3);
  const trimester3 = new Date(year, 6);
  const trimester4 = new Date(year, 9);

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
        $set: {
          trimester: {
            $switch: {
              branches: [
                _generateCase(start, trimester2, 1),
                _generateCase(trimester2, trimester3, 2),
                _generateCase(trimester3, trimester4, 3),
                _generateCase(trimester4, end, 4),
              ],
              default: 0,
            },
          },
        },
      },
      {
        $group:
          {
            _id: {
              client: '$client',
              name: '$nameClient',
              businessName: '$businessName',
              trimester: '$trimester',
            },
            sum: { $sum: '$total' },
            count: { $sum: 1 },
          },
      },

    ]
  );
};

module.exports = billing;
