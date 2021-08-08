/* eslint-disable nonblock-statement-body-position */
const TelegramBot = require('node-telegram-bot-api');

const {
  ProductModel,
  PriceChangeModel,
} = require('arroyo-erp-models');

const LogService = require('../../log.service');
const { roundNumber } = require('../../../../utils');

const TYPE = 'PriceService';

const logService = new LogService(TYPE);

/* istanbul ignore next */
/**
 * Update price of the product
 * @param {Array} ids
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

  let message = '****** Cambios de precio ******\n';

  prices.forEach(price => {
    const pricePrev = price.price - price.diff;
    const priceWithRate = pricePrev + (price.product.rate || 0);
    const costPrev = pricePrev + (priceWithRate * (price.product.iva + price.product.re));
    const diff = roundNumber(price.product.cost - costPrev);

    const row = `${price.product.name} (${price.product.nameProvider}) | PVP: ${price.cost}€ | ${diff < 0 ? '↓' : '↑'} ${diff}\n*****\n`;
    message += row;
  });

  bot.sendMessage(-1001387803762, message);
};

module.exports = sendToTelegram;
