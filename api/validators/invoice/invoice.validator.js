/* eslint-disable camelcase */
const { InvoiceModel } = require('arroyo-erp-models');
const { invoiceErrors, commonErrors } = require('../../../errors');
const { CONCEPT } = require('../../../constants');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const invoiceExist = await InvoiceModel.exists({ _id: id });
  if (!invoiceExist) throw new invoiceErrors.InvoiceIdNotFound();
};
/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);

/**
 * Check if year if valid
 * @param {String} year
 */
const isValidYear = ({ year }) => {
  // eslint-disable-next-line no-restricted-globals,radix
  if (!parseInt(year)) throw new commonErrors.ParamNotValidError();
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
const confirmParams = async ({ body: { type, paymentDate }, params: { id } }) => {
  if (!type) throw new invoiceErrors.InvoiceParamsMissing();
  if (paymentDate && typeof paymentDate !== 'number') throw new commonErrors.DateNotValid();

  const invoice = await InvoiceModel.findOne({ _id: id });

  if (_isInvalidDate(invoice.dateInvoice)) throw new invoiceErrors.InvoiceInvalidDateInvoice();
  if (invoice.nOrder) throw new invoiceErrors.InvoiceWithOrderNumber();
};

/**
 * Valida los datos envíados para crear una factura
 * @param concept
 * @param deliveryOrders
 */
const createParams = ({ concept, deliveryOrders }) => {
  if (!concept) throw new invoiceErrors.InvoiceParamsMissing();
  if (concept === CONCEPT.COMPRAS && !deliveryOrders?.length)
  // eslint-disable-next-line
    throw new invoiceErrors.InvoiceMissingDeliveryOrders();
};

module.exports = {
  confirmParams,
  validateId,
  validateIdParam,
  isValidYear,
  createParams,
};
