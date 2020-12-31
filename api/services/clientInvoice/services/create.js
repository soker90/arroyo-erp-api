const {
  ClientInvoiceModel,
} = require('arroyo-erp-models');

/**
 * Create invoice for client
 * @param {String} clientId
 */
const create = async ({ client }) => {
  const newInvoice = await new ClientInvoiceModel({
    client,
  }).save();

  return {
    id: newInvoice._id,
  };
};

module.exports = create;
