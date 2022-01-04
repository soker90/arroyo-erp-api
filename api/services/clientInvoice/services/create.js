const {
  ClientInvoiceModel,
  ClientModel,
} = require('arroyo-erp-models');

/**
 * Create invoice for client
 * @param {String} clientId
 */
const create = async ({ client }) => {
  const clientData = await ClientModel.findOne({ _id: client });
  const newInvoice = await new ClientInvoiceModel({
    client,
    nameClient: clientData.name,
    businessName: clientData.businessName,
  }).save();

  return {
    id: newInvoice._id,
  };
};

module.exports = create;
