const {
  InvoiceModel,
  DeliveryOrderModel,
} = require('arroyo-erp-models');

const _updateInvoiceAndOrders = async (invoice, nOrder) => {
  if (invoice.deliveryOrders?.length) {
    await DeliveryOrderModel.updateMany(
      { invoice: invoice._id },
      { nOrder },
    );
  }

  await InvoiceModel.updateOne({
    _id: invoice._id,
  }, { nOrder });
};
/**
 * Intercambia los números de orden de dos facturas
 * @param {string} a
 * @param {string} b
 */
const swap = async ({
  a,
  b,
}) => {
  const invoiceA = await InvoiceModel.findOne({ _id: a });
  const invoiceB = await InvoiceModel.findOne({ _id: b });

  await _updateInvoiceAndOrders(invoiceA, invoiceB.nOrder);
  await _updateInvoiceAndOrders(invoiceB, invoiceA.nOrder);
};

module.exports = swap;
