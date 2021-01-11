/* eslint-disable nonblock-statement-body-position */
const TelegramBot = require('node-telegram-bot-api');
const {
  PriceModel,
  ProductModel,
  PriceChangeModel,
} = require('arroyo-erp-models');

const LogService = require('../../log.service');

const TYPE = 'PriceService';

/**
 * Update price of the product
 * @param {Object} deliveryOrder
 * @param {number} index
 * @return {Promise<void>}
 */
const sendToTelegram = ({
  ids,
}) => {
  const token = process.env.ARROYO_TOKEN_TELEGRAM;

  const bot = new TelegramBot(token);
  bot.sendMessage(process.env.ARROYO_CHATID_TELEGRAM, 'Este es un mensaje enviado desde la aplicación del arroyo');
};

module.exports = sendToTelegram;
