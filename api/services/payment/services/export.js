const carbone = require('carbone');
const getPayments = require('./payments');
const { formatDate } = require('../../../../utils');

const _paymentsAdapter = payments => payments.map(payment => ({
  nOrden: payment.nOrder,
  fecha: formatDate(payment.invoiceDate),
  nFactura: payment.nInvoice,
  proveedor: payment.provider,
  tipo: payment.type,
  importe: payment.amount,
  fechaCobro: payment.paymentDate,
}));

/* istanbul ignore next */
const exportOds = async () => {
  const invoices = await getPayments()
    .then(payments => ({
      fecha: formatDate(Date.now()),
      pagos: _paymentsAdapter(payments),
    }));

  let paymentsFile = null;
  let error = null;

  carbone.render('./templates/pagos.ods', invoices, {
    lang: 'es-es',
  }, (err, result) => {
    /* istanbul ignore next */
    if (err) {
      error = err;
      return;
    }
    paymentsFile = result;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      /* istanbul ignore next */
      if (error) reject(error);
      /* istanbul ignore next */
      if (paymentsFile) resolve(paymentsFile);
    }, 1000);
  });
};

module.exports = exportOds;
