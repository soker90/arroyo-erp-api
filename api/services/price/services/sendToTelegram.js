/* eslint-disable nonblock-statement-body-position */
const TelegramBot = require('node-telegram-bot-api');
const nodeHtmlToImage = require('node-html-to-image');

const {
  ProductModel,
  PriceChangeModel,
} = require('arroyo-erp-models');

const LogService = require('../../log.service');
const { roundNumber } = require('../../../../utils');
const { TABLE_TEMPLATE } = require('../templates/table');

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

  const pricesForTemplate = prices.map(price => {
    const pricePrev = price.price - price.diff;
    const priceWithRate = pricePrev + (price.product.rate || 0);
    const costPrev = pricePrev + (priceWithRate * (price.product.iva + price.product.re));
    const diff = roundNumber(price.product.cost - costPrev);

    return {
      product: price.product.name,
      provider: price.product.nameProvider,
      price: price.cost,
      diff,
      upHidden: diff < 0 ? 'hidden' : '',
      downHidden: diff > 0 ? 'hidden' : '',
    };
  });

  const pricesImage = await nodeHtmlToImage({
    html: TABLE_TEMPLATE,
    content: { prices: pricesForTemplate },
  });

  bot.sendPhoto(process.env.ARROYO_CHAT_ID_TELEGRAM, pricesImage, {}, {
    caption: 'Caption text',
    contentType: 'image/png',
  });
};

module.exports = sendToTelegram;
