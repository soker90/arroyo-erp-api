const { InvoiceModel, AutoIncrement } = require('arroyo-erp-models');
const {
  InvoiceMissingDeliveryOrders,
  InvoiceMissingId,
  InvoiceIdNotFound,
  InvoiceInvalidDateInvoice,
} = require('../../../errors/invoice.errors');
const { calcNewShopping, addInvoiceToDeliveryOrder } = require('./utils');
const { invoiceAdapter } = require('./invoice.adapter');

/**
 * Create invoice
 * @param {Object} data
 */
const create = async data => {
  let invoice = {};
  if (data.deliveryOrders) {
    if (!data.deliveryOrders.length) throw new InvoiceMissingDeliveryOrders();
    invoice = await calcNewShopping(data);
  }

  const newInvoice = await new InvoiceModel(invoice).save();

  if (data.deliveryOrders) await addInvoiceToDeliveryOrder(newInvoice, invoice.deliveryOrders);

  return newInvoice;
};

/**
 * Get invoice data
 * @param {String} id
 * @returns {Promise<*>}
 */
const invoice = async ({ id }) => {
  if (!id) throw new InvoiceMissingId();

  const invoiceData = await InvoiceModel.findOne({ _id: id })
    .lean();

  if (!invoiceData) throw new InvoiceIdNotFound();
  return invoiceAdapter(invoiceData);
};
/**
 *
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoices = async ({ offset, limit }) => (
  await InvoiceModel.find({}, '_id nameProvider nOrder dateInvoice total dateRegister dateInvoice nInvoice concept')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean()
);

/**
 * Devuelve las facturas del proveedor
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoicesByProvider = async ({
  concept, provider, offset, limit,
}) => {
  const filter = {
    ...(concept && { concept }),
    ...(provider && { provider }),
  };

  return await InvoiceModel.find(filter, '_id nOrder dateInvoice total')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();
};

/**
 * Genera el número de orden correspondiente a la factura
 * @param id
 * @returns {Promise<React.NamedExoticComponent<{readonly nInvoice?: *, readonly dateInvoice?: *,
 * readonly nOrder?: *, readonly dateRegister?: *, readonly setDate?: *}>>}
 */
const invoiceConfirm = async ({ id }) => {
  const invoiceData = await InvoiceModel.findOne({ _id: id });
  console.log(id);

  if (!invoiceData) throw new InvoiceIdNotFound();
  if (!invoiceData.dateInvoice || typeof invoiceData.dateInvoice !== 'number') throw new InvoiceInvalidDateInvoice();

  const dateInvoice = new Date(invoiceData.dateInvoice);

  invoiceData.nOrder = await AutoIncrement.increment(`invoice${dateInvoice.getFullYear()}`);

  return invoiceData;
};

module.exports = {
  create,
  invoice,
  invoices,
  invoicesByProvider,
  invoiceConfirm,
};
