const { InvoiceModel, AutoIncrement } = require('arroyo-erp-models');
const {
  InvoiceMissingDeliveryOrders,
  InvoiceMissingId,
  InvoiceIdNotFound,
  InvoiceInvalidDateInvoice,
  InvoiceParamsMissing,
} = require('../../../errors/invoice.errors');
const { calcNewShopping, addInvoiceToDeliveryOrder, refreshBilling } = require('./utils');
const { invoiceAdapter, invoiceDataAdapter } = require('./invoice.adapter');

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
const invoicesShort = async ({
  concept, provider, offset, limit,
}) => {
  const filter = {
    ...(concept && { concept }),
    ...(provider && { provider }),
  };

  return await InvoiceModel.find(filter, '_id nOrder nInvoice dateInvoice total')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();
};

/**
 * Genera el número de orden correspondiente a la factura
 * @param {String} id
 * @returns {Promise<{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}>}
 */
const invoiceConfirm = async ({ id }) => {
  const invoiceData = await InvoiceModel.findOne({ _id: id });

  if (!invoiceData) throw new InvoiceIdNotFound();
  if (!invoiceData.dateInvoice || typeof invoiceData.dateInvoice !== 'number') throw new InvoiceInvalidDateInvoice();

  const dateInvoice = new Date(invoiceData.dateInvoice);

  invoiceData.nOrder = await AutoIncrement.increment(`invoice${dateInvoice.getFullYear()}`);
  invoiceData.save()
    .then(() => refreshBilling(invoiceData.dateInvoice, invoiceData.provider));

  return invoiceDataAdapter(invoiceData);
};

/**
 * Modifica la factura
 * @param {String} id
 * @param {{dateRegister: number, dateInvoice: number, nInvoice: string}} data
 * @param {{total: number, iva: number, re: number, rate: number, taxBase: number}} totals
 * @returns {*}
 */
const invoiceEdit = ({ params: { id }, body: { data, totals } }) => {
  if (!id) throw new InvoiceMissingId();
  let newData = {};

  if (!data && !totals) throw new InvoiceParamsMissing();

  if (data) {
    const { dateRegister, dateInvoice, nInvoice } = data;
    newData = {
      dateRegister,
      dateInvoice,
      nInvoice,
    };
  }

  if (totals) {
    const {
      total, iva, re, rate, taxBase,
    } = totals;
    newData = {
      ...newData,
      total,
      iva,
      re,
      rate,
      taxBase,
    };
  }

  return InvoiceModel
    .findOneAndUpdate({ _id: id }, newData, { new: true })
    .then(invoiceUpdated => {
      const adapter = invoiceAdapter(invoiceUpdated);
      return {
        ...(data && { data: adapter.data }),
        ...(totals && { totals: adapter.totals }),
      };
    });
};

module.exports = {
  create,
  invoice,
  invoices,
  invoicesShort,
  invoiceConfirm,
  invoiceEdit,
};
