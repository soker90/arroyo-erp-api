const { DeliveryOrderModel } = require('arroyo-erp-models');

/**
 * Devuelve los albaranes no incluidos en una factura
 * @param {String} provider
 * @param {String} client
 * @returns {Array}
 * @private
 */
const _getFree = ({ provider, client }) => DeliveryOrderModel.find({
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
 * @returns {Array}
 * @private
 */
const _getInInvoices = ({
  provider, client, offset, limit,
}) => (
  DeliveryOrderModel.find({
    provider,
    client,
    invoice: { $exists: true },
  })
    .sort({ date: -1 })
    .skip(parseInt(offset, 10))
    .limit(parseInt(limit, 10))
);

/**
 * Devuelve el número de albaren incluidos en facturas
 * @param {String} provider
 * @param {String} client
 * @returns {Number}
 * @private
 */
const _countInInvoices = ({ provider, client }) => (
  DeliveryOrderModel.find({
    provider,
    client,
    invoice: { $exists: true },
  })
    .countDocuments()
);

/**
 * Return all delivery orders
 * @return {Promise<{free: Array, inInvoice: Array, inInvoiceCount: Number}>}
 */
const orders = async data => ({
  free: await _getFree(data),
  inInvoices: await _getInInvoices(data),
  inInvoiceCount: await _countInInvoices(data),
});

module.exports = orders;
