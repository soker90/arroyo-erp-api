/* eslint-disable nonblock-statement-body-position */
const TelegramBot = require('node-telegram-bot-api');
const {
  ProductModel,
  PriceChangeModel,
} = require('arroyo-erp-models');

const LogService = require('../../log.service');

const TYPE = 'PriceService';

const logService = new LogService(TYPE);

/**
 * Update price of the product
 * @param {Object} deliveryOrder
 * @param {number} index
 * @return {Promise<void>}
 */
const sendToTelegram = async ({
  ids,
}) => {
  logService.logInfo('Enviando mensaje a telegram');
  const token = process.env.ARROYO_TOKEN_TELEGRAM;
  const bot = new TelegramBot(token);

  const prices = await PriceChangeModel.find({ _id: { $in: ids } })
    .populate('product', null, ProductModel);

  let message = '--------------------------------------------------------------------\n'
    + '| Producto | Proveedor | Precio | Diferencia\n';

  prices.forEach(price => {
    const pricePrev = price.price - price.diff;
    const priceWithRate = pricePrev + (price.product.rate || 0);
    const costPrev = pricePrev + (priceWithRate * (price.product.iva + price.product.re));
    const diff = costPrev - price.product.cost;
    const row = '--------------------------------------------------------------------\n'
      + `| ${price.product.name} | ${price.product.nameProvider} | ${price.product.cost} | ${diff}\n`;
    message += row;
  });

  message += '--------------------------------------------------------------------';

  bot.sendMessage(process.env.ARROYO_CHAT_ID_TELEGRAM, message);
};

module.exports = sendToTelegram;
