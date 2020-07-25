const { InvoiceModel } = require('arroyo-erp-models');
const {
  InvoiceMissingDeliveryOrders,
  InvoiceMissingId,
  InvoiceIdNotFound,
  InvoiceParamsMissing,
} = require('../../../errors/invoice.errors');
const {
  calcNewShopping, addInvoiceToDeliveryOrder,
} = require('./utils');
const { invoiceAdapter } = require('./invoice.adapter');

// Split services
const invoiceConfirm = require('./invoiceConfirm');

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
  return invoiceData;
};
/**
 *
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoices = async ({ offset, limit, year }) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return await InvoiceModel.find({
    dateRegister: {
      $gte: start,
      $lt: end,
    },
  }, '_id nameProvider nOrder dateInvoice total dateRegister dateInvoice nInvoice concept')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();
};

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
    .then(invoiceUpdated => ({
      invoice: invoiceUpdated,
      data: Boolean(data),
      totals: Boolean(totals),
    }));
};

module.exports = {
  create,
  invoice,
  invoices,
  invoicesShort,
  invoiceConfirm,
  invoiceEdit,
};
