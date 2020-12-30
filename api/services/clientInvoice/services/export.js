const carbone = require('carbone');
const { InvoiceModel } = require('arroyo-erp-models');
const { COLUMNS_INVOICES } = require('../../../../constants/invoices');
const { formatDate } = require('../../../../utils');

const getCategoryTotal = (invoice, column) => (invoice.bookColumn === column ? invoice.total : null);
const getRe = invoice => (invoice.bookColumn === COLUMNS_INVOICES.ALQUILER ? invoice.re : null);

const _invoicesAdapter = invoices => invoices.map(invoice => {
  const re = getRe(invoice);
  return {
    nOrden: invoice.nOrder,
    fechaRegistro: formatDate(invoice.dateRegister),
    fechaFactura: formatDate(invoice.dateInvoice),
    nFactura: invoice.nInvoice,
    nombreProveedor: invoice.businessName,
    cif: invoice.cif,
    concepto: invoice.concept,
    codigo: invoice.code,
    compras: getCategoryTotal(invoice, COLUMNS_INVOICES.COMPRAS),
    autonomos: getCategoryTotal(invoice, COLUMNS_INVOICES.AUTONOMOS),
    salario: getCategoryTotal(invoice, COLUMNS_INVOICES.SALARIO),
    alquiler: getCategoryTotal(invoice, COLUMNS_INVOICES.ALQUILER),
    suministros: getCategoryTotal(invoice, COLUMNS_INVOICES.SUMINISTROS),
    comisiones: getCategoryTotal(invoice, COLUMNS_INVOICES.COMISIONES),
    tributos: getCategoryTotal(invoice, COLUMNS_INVOICES.TRIBUTOS),
    reparacion: getCategoryTotal(invoice, COLUMNS_INVOICES.REPARACION),
    seguros: getCategoryTotal(invoice, COLUMNS_INVOICES.SEGUROS),
    otros: getCategoryTotal(invoice, COLUMNS_INVOICES.OTROS),
    retencion: re,
    total: invoice.total - re,
  };
});

const _getDates = (year, month) => {
  if (month) {
    const start = new Date(`${year}-${month}`);
    const nextMonth = Number(month) + 3;
    const end = (nextMonth > 12)
      ? new Date(`${Number(year) + 1}-1`)
      : new Date(`${year}-${nextMonth}`);
    return {
      start,
      end,
    };
  }
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return {
    start,
    end,
  };
};
const _getInvoices = async (year, month) => {
  const {
    start,
    end,
  } = _getDates(year, month);

  const invoices = await InvoiceModel.find({
    dateRegister: {
      $gte: start,
      $lt: end,
    },
  })
    .sort({ nOrder: 1 })
    .lean();

  return _invoicesAdapter(invoices);
};

const exportOds = async ({ year, month }) => {
  const invoices = await _getInvoices(year, month);

  let bookFile = null;
  let error = null;

  carbone.render('./templates/book.ods', invoices, {
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

module.exports = exportOds;
