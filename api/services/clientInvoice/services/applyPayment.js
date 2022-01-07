const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Create invoice
 * @param {Object} data
 */
const applyPayment = async ({
  params: {
    id,
  },
  body: {
    paymentDate,
    paymentType,
  },
}) => {
  const invoice = await ClientInvoiceModel.findOneAndUpdate({
    _id: id,
  }, {
    paymentDate,
    paymentType,
    paid: true,
  });

  // Para devolver el listado actualizado del año
  return {
    year: new Date(invoice.date).getFullYear()
      .toString(),
  };
};

module.exports = applyPayment;
