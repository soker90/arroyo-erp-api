const { InvoiceModel, DeliveryOrderModel } = require('arroyo-erp-models');
const generateOrderNumber = require('../../../../components/generate-num-order');
const { isTypeCash } = require('../../../../utils');

/**
 * Añade el numero de orden de la factura a los albaranes
 * @param {Object} invoice
 * @returns {Promise<void>}
 */
const _addNOrderToDeliveryOrder = async invoice => {
  const { nOrder } = invoice;
  // eslint-disable-next-line no-restricted-syntax
  for (const deliveryOrder of invoice.deliveryOrders) {
    // eslint-disable-next-line no-await-in-loop
    const model = await DeliveryOrderModel
      .findOneAndUpdate({ _id: deliveryOrder }, { nOrder });
    model.save();
  }
};

/**
 * Genera el número de orden correspondiente a la factura
 * @param {String} id
 * @param {Number} datePayment
 * @param {String} type
 * @returns {Promise<{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}>}
 */
const invoiceConfirm = async ({ params: { id }, body: { paymentDate, type } }) => {
  const invoiceData = await InvoiceModel.findOne({ _id: id });
  invoiceData.nOrder = await generateOrderNumber(invoiceData.dateInvoice);

  invoiceData.payment = {
    paymentDate,
    type,
    ...(isTypeCash(type) && { paid: true }),
  };

  const invoice = await invoiceData.save();
  await _addNOrderToDeliveryOrder(invoice);

  return invoiceData;
};

module.exports = invoiceConfirm;
