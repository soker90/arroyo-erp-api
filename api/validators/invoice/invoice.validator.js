/* eslint-disable camelcase, nonblock-statement-body-position */
const { InvoiceModel, AutoIncrement, PaymentModel } = require('arroyo-erp-models');
const { invoiceErrors, commonErrors } = require('../../../errors');
const { CONCEPT, TYPE_PAYMENT } = require('../../../constants');
const { isNumber } = require('../../../utils');

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
  if (type === TYPE_PAYMENT.CASH && !paymentDate) throw new commonErrors.DateNotValid();

  const invoice = await InvoiceModel.findOne({ _id: id });

  if (_isInvalidDate(invoice.dateInvoice)) throw new invoiceErrors.InvoiceInvalidDateInvoice();
  if (invoice.nOrder) throw new invoiceErrors.InvoiceWithOrderNumber();
};

/**
 * Valida los datos envíados para crear una factura
 * @param concept
 * @param deliveryOrders
 */
const createParams = ({
  concept, deliveryOrders, dateInvoice, dateRegister, total, provider, type, bookColumn, re,
}) => {
  if (!concept || !bookColumn) throw new invoiceErrors.InvoiceParamsMissing();

  if (concept === CONCEPT.COMPRAS && !deliveryOrders?.length)
    throw new invoiceErrors.InvoiceMissingDeliveryOrders();

  if (![CONCEPT.COMPRAS].includes(concept)) {
    if (!isNumber(dateInvoice) || !isNumber(dateRegister) || !isNumber(total)
      || !provider || !type || (re && !isNumber(re)))
      throw new invoiceErrors.InvoiceParamsMissing();
  }
};

const editBody = ({ body: { data, totals } }) => {
  if (!data && !totals) throw new invoiceErrors.InvoiceParamsMissing();
};

const isRemovable = async ({ id }) => {
  const invoice = await InvoiceModel.findOne({ _id: id });
  const year = new Date(invoice.dateInvoice).getFullYear();
  const lastDocument = await AutoIncrement.findOne({ name: `invoice${year}` });

  // Si está confirmada y no es la última factura del año no se puede borrar
  if (invoice.nOrder && lastDocument?.seq && invoice.nOrder !== lastDocument?.seq)
    throw new invoiceErrors.InvoiceNoRemovable();

  // Comprueba que no exista ningún pago fusionado con esta factura
  const payments = await PaymentModel.find({ invoices: id });
  if (payments.length > 1)
    throw new invoiceErrors.PaymentMerged();
};

module.exports = {
  confirmParams,
  validateId,
  validateIdParam,
  isValidYear,
  createParams,
  editBody,
  isRemovable,
};
