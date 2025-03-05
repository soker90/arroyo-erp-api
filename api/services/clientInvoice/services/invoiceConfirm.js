const { ClientInvoiceModel } = require('arroyo-erp-models');
const generateNumberInvoice = require('../../../../components/generate-num-invoice');

/**
 * Genera el número de factura
 * @param {String} id
 * @returns {{nInvoice: String}}
 */
const invoiceConfirm = async ({ id }) => {
  const invoiceData = await ClientInvoiceModel.findOne({ _id: id });

  let num = await generateNumberInvoice(invoiceData.date);
  const date = new Date(invoiceData.date).getYear() - 100;
  if (num < 100) num = num.toString().padStart(3, '0');
  const nInvoice = `${date}-${num}`;

  await ClientInvoiceModel.updateOne({ _id: id }, { nInvoice });

  return { nInvoice };
};

module.exports = invoiceConfirm;
