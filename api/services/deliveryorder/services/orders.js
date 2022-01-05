const {
  DeliveryOrderModel,
  ProviderModel,
} = require('arroyo-erp-models');

/**
 * Devuelve los albaranes no incluidos en una factura
 * @param {String} provider
 * @param {String} client
 * @returns {Array}
 * @private
 */
const _getFree = ({
  provider,
  client,
}) => DeliveryOrderModel.find({
  provider,
  client,
  invoice: { $exists: false },
})
  .sort({ date: 1 });

/**
 * Devulve los albaranes incluidos en una factura
 * @param {String} provider
 * @param {String} offset
 * @param {String} limit
 * @param {String} client
 * @param {String} canal
 * @returns {Array}
 * @private
 */
const _getInInvoices = ({
  provider,
  client,
  offset,
  limit,
  canal,
}) => (
  DeliveryOrderModel.find({
    provider,
    client,
    invoice: { $exists: true },
    ...(canal && { 'products.canal': canal }),
  })
    .sort({ date: -1 })
    .skip(parseInt(offset, 10) || 0)
    .limit(parseInt(limit, 10) || 10)
);

/**
 * Devuelve el número de albaren incluidos en facturas
 * @param {String} provider
 * @param {String} client
 * @param {String} canal
 * @returns {Number}
 * @private
 */
const _countInInvoices = ({
  provider,
  client,
  canal,
}) => (
  DeliveryOrderModel.find({
    provider,
    client,
    invoice: { $exists: true },
    ...(canal && { 'products.canal': canal }),
  })
    .countDocuments()
);

const _hasCanal = ({ provider }) => (ProviderModel.findOne({ _id: provider }, 'hasCanal'));
/**
 * Return all delivery orders
 * @return {Promise<{hasCanal: *, inInvoices: *, free: *, inInvoiceCount: *}>}
 */
const orders = async data => ({
  free: await _getFree(data),
  inInvoices: await _getInInvoices(data),
  inInvoiceCount: await _countInInvoices(data),
  hasCanal: await _hasCanal(data),
});

module.exports = orders;
