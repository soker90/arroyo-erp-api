const { DeliveryOrderModel } = require('arroyo-erp-models');
const orderByProvider = require('../../billing/utils/orderByProvider');

const _countByMonthAndProvider = year => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  // 43200000 es medio dia, para que coja el dia 1 de cada mes
  const aggregatorOpts = [
    {
      $match: {
        invoice: { $exists: false },
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
            provider: '$provider',
            nameProvider: '$nameProvider',
            month: { $month: { $add: [new Date(0), { $add: ['$date', 43200000] }] } },
          },
          count: { $sum: 1 },
        },
    },
  ];

  return DeliveryOrderModel.aggregate(aggregatorOpts)
    .exec();
};

const _getQuarter = month => parseInt((month - 1) / 3) + 1;

const _generateInitialData = deliveryOrder => ({
  provider: deliveryOrder._id.provider,
  name: deliveryOrder._id.nameProvider,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  total: 0,
});
/**
 * Cuenta los albaranes sin factura del año dado
 * @return {Promise<[]>}
 */
const countFree = async ({ year }) => {
  const deliveryOrderInfo = await _countByMonthAndProvider(year);

  const deliveryOrderCount = {};

  deliveryOrderInfo.forEach(deOr => {
    /* istanbul ignore else */
    if (!deliveryOrderCount[deOr._id.provider]) deliveryOrderCount[deOr._id.provider] = _generateInitialData(deOr);

    const quarter = _getQuarter(deOr._id.month);

    deliveryOrderCount[deOr._id.provider][quarter] += deOr.count;
    deliveryOrderCount[deOr._id.provider].total += deOr.count;
  });

  return Object.values(deliveryOrderCount).sort(orderByProvider);
};

module.exports = countFree;
