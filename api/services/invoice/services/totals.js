const { InvoiceModel } = require('arroyo-erp-models');

const { calcQuarter } = require('../../../../utils');
const { roundNumber } = require('../../../../utils');

const _sumByMonth = (year, type) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  // 43200000 es medio dia, para que coja el dia 1 de cada mes
  const aggregatorOpts = [
    {
      $match: {
        'payment.type': type,
        dateRegister: {
          $gte: start.getTime() - 43200000,
          $lt: end.getTime() - 43200000,
        },
      },
    },
    {
      $group:
        {
          _id: {
            month: { $month: { $add: [new Date(0), { $add: ['$dateRegister', 43200000] }] } },
          },
          sum: { $sum: '$total' },
        },
    },
  ];

  return InvoiceModel.aggregate(aggregatorOpts)
    .exec();
};

/**
 * Cuenta los albaranes sin factura del año dado
 * @return {Promise<{'1': number, '2': number, total: number, '3': number, '4': number}>}
 */
const totals = async ({
  year,
  type,
}) => {
  const sumByMonth = await _sumByMonth(year, type);

  const totalsSum = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    total: 0,
  };

  sumByMonth.forEach(monthSum => {
    const quarter = calcQuarter(monthSum._id.month);

    const sum = roundNumber(monthSum.sum);
    totalsSum[quarter] += sum;
    totalsSum.total += sum;
  });

  return totalsSum;
};

module.exports = totals;
