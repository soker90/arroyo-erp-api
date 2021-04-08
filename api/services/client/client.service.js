const {
  ClientModel,
  ClientInvoiceModel,
} = require('arroyo-erp-models');

const ClientInvoiceService = require('../clientInvoice');
/**
 * Return all providers
 * @return {Promise<{data: any}>}
 */
const clients = async () => {
  const client = await ClientModel.find({}, 'name _id note')
    .collation({ locale: 'es' })
    .sort({ name: 1 })
    .lean();
  const count = await ClientInvoiceModel.aggregate([
    {
      $group: {
        _id: '$client',
        count: { $count: 1 },
      },
    },
  ])
    .exec();
};

/**
 * Create product
 * @param {Object} data
 */
const create = data => new ClientModel(data).save();

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = ({
  params,
  body,
}) => (
  ClientModel.findOneAndUpdate({ _id: params.id }, { $set: body })
);

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const client = async ({ id }) => {
  const clientData = await ClientModel.findOne({ _id: id })
    .lean();
  const invoices = await ClientInvoiceService.invoicesShort({
    client: id,
    limit: 10,
  });

  return {
    client: clientData,
    ...invoices,
  };
};

module.exports = {
  clients,
  create,
  update,
  client,
};
