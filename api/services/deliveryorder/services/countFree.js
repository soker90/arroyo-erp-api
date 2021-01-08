const { DeliveryOrderModel } = require('arroyo-erp-models');

const _countByMonthAndProvider = year => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  const aggregatorOpts = [
    {
      $match: {
        nOrder: { $exists: false },
        date: {
          $gte: start.getTime(),
          $lt: end.getTime(),
        },
      },
    },
    {
      $group:
        {
          _id: {
            provider: '$provider',
            nameProvider: '$nameProvider',
            month: { $month: { $add: [new Date(0), '$date'] } },
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
  nameProvider: deliveryOrder._id.nameProvider,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  total: 0,
});
/**
 * Create payment
 * @return {Promise<[]>}
 */
const countFree = async ({ year }) => {
  const deliveryOrderInfo = await _countByMonthAndProvider(year);

  const deliveryOrderCount = {};

  deliveryOrderInfo.forEach(deOr => {
    if (!deliveryOrderCount[deOr._id.provider]) deliveryOrderCount[deOr._id.provider] = _generateInitialData(deOr);

    const quarter = _getQuarter(deOr._id.month);

    deliveryOrderCount[deOr._id.provider][quarter] = deliveryOrderCount[deOr._id.provider][quarter] + deOr.count;
    deliveryOrderCount[deOr._id.provider].total = deliveryOrderCount[deOr._id.provider].total + deOr.count;
  });

  console.log(deliveryOrderCount);
  return Object.values(deliveryOrderCount);
};

module.exports = countFree;
