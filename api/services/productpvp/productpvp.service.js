const {
  ProductPvpModel,
} = require('arroyo-erp-models');

const LogService = require('../log.service');

const TYPE = 'ProductPvpService';

const logService = new LogService(TYPE);

const addPrice = async ({
  params,
  body: {
    sale,
  },
}) => {
  const lastPrice = await ProductPvpModel.findOne({ product: params.id })
    .sort({ _id: -1 });
  if (sale !== lastPrice.price) {
    await ProductPvpModel.create({
      product: params.id,
      price: sale,
      date: Date.now(),
    });

    logService.logInfo(`Actualizado precio de ${params.id} a ${sale}`);
  }
};

module.exports = {
  addPrice,
};
