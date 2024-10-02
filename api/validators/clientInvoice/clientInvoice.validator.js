/* eslint-disable camelcase, nonblock-statement-body-position */
const {
  ClientInvoiceModel,
  AutoIncrement,
} = require('arroyo-erp-models');
const {
  invoiceErrors,
  commonErrors,
  deliveryOrderErrors,
} = require('../../../errors');
const { isNumber } = require('../../../utils');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const invoiceExist = await ClientInvoiceModel.exists({ _id: id });
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
const isValidForConfirmed = async ({
  id,
}) => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id });

  if (invoice.nInvoice) throw new invoiceErrors.InvoiceWithOrderNumber();
  if (_isInvalidDate(invoice.date)) throw new invoiceErrors.InvoiceInvalidDateInvoice();
};

const editBody = ({
  body: {
    date,
    totals,
  },
}) => {
  if (date === undefined && !totals) throw new invoiceErrors.InvoiceParamsMissing();
};

const isRemovable = async ({ id }) => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id });
  const year = new Date(invoice.date).getFullYear();
  const lastDocument = await AutoIncrement.findOne({ name: `clientInvoice${year}` });
  let lastNumber;
  if (invoice.nInvoice)
    lastNumber = Number(invoice.nInvoice.split('-')[1]);

  // Si está confirmada y no es la última factura del año no se puede borrar
  if (invoice.nInvoice && lastDocument?.seq && lastNumber !== lastDocument?.seq)
    throw new invoiceErrors.InvoiceNoRemovable();
};

/**
 * Check if invalid date
 * @param {number} date
 * @private
 */
const isValidDate = ({ body: { date } }) => {
  if (date && typeof date !== 'number')
    throw new commonErrors.DateNotValid();
};

const validateDeliveryOrder = async ({ deliveryOrder }) => {
  const doExist = await ClientInvoiceModel.exists({ 'deliveryOrders._id': deliveryOrder });
  if (!doExist) throw new deliveryOrderErrors.DeliveryOrderNotFound();
};

const validateDeliveryOrderParam = async ({ params }) => validateDeliveryOrder(params);

const isDORemovable = async ({
  id,
  deliveryOrder,
}) => {
  const invoiceDO = await ClientInvoiceModel.findOne({
    _id: id,
    'deliveryOrders._id': deliveryOrder,
  }, { 'deliveryOrders.$': 1 });

  if (invoiceDO?.deliveryOrders?.[0]?.products?.length)
    throw new deliveryOrderErrors.DeliveryOrderNoRemovable();
};

const validateProduct = ({
  body: {
    name,
    weight,
    unit,
    price,
  },
}) => {
  if (!isNumber(weight) || !isNumber(price) || !name || !unit)
    throw new invoiceErrors.InvoiceParamsMissing();
};

const isValidPaymentBody = ({
  body: {
    paymentType,
    paymentDate,
  },
}) => {
  if (!paymentType) throw new invoiceErrors.InvoiceParamsMissing();
  if (paymentDate && typeof paymentDate !== 'number') throw new commonErrors.DateNotValid();
};

module.exports = {
  validateId,
  validateIdParam,
  editBody,
  isRemovable,
  isValidDate,
  validateDeliveryOrder,
  isDORemovable,
  validateDeliveryOrderParam,
  validateProduct,
  isValidForConfirmed,
  isValidPaymentBody,
};
