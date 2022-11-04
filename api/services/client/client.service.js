const {
  ClientModel,
  ClientInvoiceModel,
} = require('arroyo-erp-models');

const { orderByName } = require('../../../utils');
/**
 * Return all providers
 * @return {Promise<{data: any}>}
 */
const clients = async () => {
  const currentYearDate = new Date(`${new Date().getFullYear()}`);
  const clientList = await ClientModel.find({});
  clientList.sort(orderByName);
  const invoices = await ClientInvoiceModel.aggregate([
    {
      $match: {
        date: {
          $gte: currentYearDate.getTime() - 43200000,
        },
      },
    },
    {
      $group: {
        _id: '$client',
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

  const invoicesPending = await ClientInvoiceModel.aggregate([
    {
      $match: {
        nInvoice: { $exists: false },
      },
    },
    {
      $group: {
        _id: '$client',
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

  return {
    clients: clientList,
    invoices,
    invoicesPending,
  };
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
  ClientModel.findOneAndUpdate({ _id: params.id }, { $set: body }, { new: true })
);

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const client = async ({ id }) => {
  const clientData = await ClientModel.findOne({ _id: id })
    .lean();

  return clientData;
};

module.exports = {
  clients,
  create,
  update,
  client,
};
