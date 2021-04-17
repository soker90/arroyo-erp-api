const {
  ClientModel,
  ClientInvoiceModel,
} = require('arroyo-erp-models');

const ClientInvoiceService = require('../clientInvoice');
/**
 * Return all providers
 * @return {Promise<{data: any}>}
 */
const clients = () => {
  const currentYearDate = new Date(`${new Date().getFullYear()}`);
  return ClientInvoiceModel.aggregate([
    {
      $match: {
        date: {
          $gte: currentYearDate.getTime() - 43200000,
        },
      },
    },
    {
      $group: {
        _id: {
          _id: '$client',
          name: '$nameClient',
        },
        invoices: { $sum: 1 },
      },
    },
    {
      $sort: {
        name: 1,
      },
    },
  ])
    .collation({ locale: 'es' })
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
