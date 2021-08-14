/* eslint-disable nonblock-statement-body-position */
const TelegramBot = require('node-telegram-bot-api');

const {
  ProductModel,
  PriceChangeModel,
} = require('arroyo-erp-models');

const LogService = require('../../log.service');

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
    const row = `${price.product.name} (${price.product.nameProvider}) | Coste: ${price.cost}€ | ${price.diff < 0 ? '↓' : '↑'} ${price.diff}\n*****\n`;
    message += row;
  });

  bot.sendMessage(process.env.ARROYO_CHAT_ID_TELEGRAM, message);
};

module.exports = sendToTelegram;
