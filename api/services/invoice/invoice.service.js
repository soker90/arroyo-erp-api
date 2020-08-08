const { InvoiceModel } = require('arroyo-erp-models');
const {
  InvoiceMissingId,
  InvoiceIdNotFound,
} = require('../../../errors/invoice.errors');

// Split services
const invoiceConfirm = require('./invoiceConfirm');
const create = require('./create');
const invoiceEdit = require('./invoiceEdit');

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
const invoices = ({ offset, limit, year }) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return InvoiceModel.find({
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
const invoicesShort = ({
  concept, provider, offset, limit,
}) => {
  const filter = {
    ...(concept && { concept }),
    ...(provider && { provider }),
  };

  return InvoiceModel.find(filter, '_id nOrder nInvoice dateInvoice total payment.type payment.paid')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();
};

module.exports = {
  create,
  invoice,
  invoices,
  invoicesShort,
  invoiceConfirm,
  invoiceEdit,
};
