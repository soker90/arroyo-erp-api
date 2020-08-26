const { InvoiceModel, AutoIncrement, DeliveryOrderModel } = require('arroyo-erp-models');
const {
  refreshBilling,
} = require('../utils');
const { TYPE_PAYMENT } = require('../../../../constants/payments');

/**
 * Generate new order number for the year
 * @param {Number} date
 * @returns {Promise<number>}
 * @private
 */
const _generateOrderNumber = date => {
  const dateInvoice = new Date(date);
  return AutoIncrement.increment(`invoice${dateInvoice.getFullYear()}`);
};

/**
 * Añade el numero de orden de la factura a los albaranes
 * @param {Object} invoice
 * @returns {Promise<void>}
 */
const _addNOrderToDeliveryOrder = async invoice => {
  const { nOrder } = invoice;
  for (const deliveryOrder of invoice.deliveryOrders) {
    const model = await DeliveryOrderModel
      .findOneAndUpdate({ _id: deliveryOrder._id }, { nOrder });
    model.save();
  }
};

/**
 * Devuelve si el tipo de pago es efectivo
 * @param {String} type
 * @returns {boolean}
 */
const isTypeCash = type => type === TYPE_PAYMENT.CASH;
/**
 * Genera el número de orden correspondiente a la factura
 * @param {String} id
 * @param {Number} datePayment
 * @param {String} type
 * @returns {Promise<{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}>}
 */
const invoiceConfirm = async ({ params: { id }, body: { paymentDate, type } }) => {
  const invoiceData = await InvoiceModel.findOne({ _id: id });
  invoiceData.nOrder = await _generateOrderNumber(invoiceData.dateInvoice);

  invoiceData.payment = {
    paymentDate,
    type,
    ...(isTypeCash(type) && { paid: true }),
  };

  const invoice = await invoiceData.save();
  await _addNOrderToDeliveryOrder(invoice);
  await refreshBilling(invoiceData.dateInvoice, invoiceData.provider);

  return invoiceData;
};

module.exports = invoiceConfirm;
