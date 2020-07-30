/* eslint-disable camelcase */
const { InvoiceModel } = require('arroyo-erp-models');
const { invoiceErrors } = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = async ({ params: { id } }) => {
  const invoiceExist = await InvoiceModel.exists({ _id: id });
  if (!invoiceExist) throw new invoiceErrors.InvoiceIdNotFound();
};

/**
 * Check if invalid date
 * @param {number} date
 * @returns {boolean}
 * @private
 */
const _isInvalidDate = date => !date || typeof date !== 'number';

/**
 * Validate params for confirm invoice
 * @param {String} type
 * @param {String} id
 * @returns {Promise<void>}
 */
const confirmParams = async ({ body: { type }, params: { id } }) => {
  if (!type) throw new invoiceErrors.InvoiceParamsMissing();

  const invoice = await InvoiceModel.findOne({ _id: id });

  if (_isInvalidDate(invoice.dateInvoice)) throw new invoiceErrors.InvoiceInvalidDateInvoice();
  if (invoice.nOrder) throw new invoiceErrors.InvoiceWithOrderNumber();
};

module.exports = {
  confirmParams,
  validateId,
};
