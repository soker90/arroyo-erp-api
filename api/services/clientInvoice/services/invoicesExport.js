const carbone = require('carbone');
const {
  ClientInvoiceModel,
  ClientModel,
} = require('arroyo-erp-models');
const { formatDate } = require('../../../../utils');

const _invoicesAdapter = invoices => invoices.map(invoice => ({
  fechaFactura: formatDate(invoice.date),
  nFactura: invoice.nInvoice,
  nombreCliente: invoice.businessName,
  tipo: invoice?.paymentType,
  fechaPago: formatDate(invoice?.paymentDate),
  total: invoice?.total,
  cif: invoice?.client?.cif,
}));

const _getDates = year => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return {
    start,
    end,
  };
};

/* istanbul ignore next */
const _getInvoices = async ({
  year,
} = {}) => {
  const {
    start,
    end,
  } = _getDates(year);

  const searchParams = {
    nInvoice: { $exists: true },
    date: {
      $gte: start,
      $lt: end,
    },
  };

  const invoices = await ClientInvoiceModel.find(searchParams)
    .populate('client', null, ClientModel)
    .sort({ nOrder: 1 })
    .lean();

  return _invoicesAdapter(invoices);
};

const invoicesExport = async filters => {
  const invoices = await _getInvoices(filters);

  let bookFile = null;
  let error = null;

  carbone.render('./templates/libro-clientes.ods', invoices, {
    lang: 'es-es',
  }, (err, result) => {
    /* istanbul ignore next */
    if (err) {
      error = err;
      return;
    }
    bookFile = result;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      /* istanbul ignore next */
      if (error) reject(error);
      /* istanbul ignore next */
      if (bookFile) resolve(bookFile);
    }, 1000);
  });
};

module.exports = invoicesExport;
