/* eslint-disable no-nested-ternary */
const carbone = require('carbone');
const {
  ClientInvoiceModel,
  ClientModel,
} = require('arroyo-erp-models');
const { formatDate } = require('../../../../utils');

const INVOICE_1_TEMPLATE = './templates/factura-1-hoja.ods';
const INVOICE_2_TEMPLATE = './templates/factura-2-hojas.ods';
const INVOICE_3_TEMPLATE = './templates/factura-3-hojas.ods';
const INVOICE_4_TEMPLATE = './templates/factura-4-hojas.ods';

const UNITS_WITHOUT_DECIMALS = ['ud', 'uds'];

const generateWeight = ({
  weight,
  unit,
}) => (UNITS_WITHOUT_DECIMALS.includes(unit)
  ? `${weight} ${unit}`
  : `${weight.toLocaleString('es-ES', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} ${unit}`);

/* istanbul ignore next */
const _productAdapter = product => ({
  descripcion: product.name,
  peso: generateWeight(product),
  precio: product.price.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  importe: product.total.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
});

/* istanbul ignore next */
const _doAdapter = deliveryOrder => {
  let rows = [];
  if (deliveryOrder.date) rows.push({ fecha: formatDate(deliveryOrder.date) });

  rows = [
    ...rows,
    ...deliveryOrder.products.map(_productAdapter),
  ];

  return rows;
};

/* istanbul ignore next */
const _invoicesAdapter = invoice => {
  const filasAll = invoice.deliveryOrders.map(_doAdapter)
    .flat();

  return ({
    fecha: formatDate(invoice.date),
    nFactura: invoice.nInvoice,
    empresa: invoice.client.businessName,
    direccion: invoice.client.address,
    ciudad: invoice.client.city,
    cp: invoice.client.postalCode,
    provincia: invoice.client.province,
    cif: invoice.client.cif,
    mostrarIban: invoice.client.transfer,
    filas: filasAll.slice(0, 48),
    filas2: filasAll.slice(49, 97),
    filas3: filasAll.slice(98, 145),
    filas4: filasAll.slice(146, 250),
    nFilas: filasAll.length,
    base: invoice.taxBase,
    iva: invoice.iva,
    total: invoice.total,
  });
};

/* istanbul ignore next */
const _getInvoice = async id => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id })
    .populate('client', null, ClientModel);

  return _invoicesAdapter(invoice);
};

/* istanbul ignore next */
const _getTemplate = ({ nFilas }) => {
  if (nFilas < 51) return INVOICE_1_TEMPLATE;
  if (nFilas < 101) return INVOICE_2_TEMPLATE;
  if (nFilas < 151) return INVOICE_3_TEMPLATE;
  return INVOICE_4_TEMPLATE;
};

/* istanbul ignore next */
const exportOds = async ({ id }) => {
  const invoice = await _getInvoice(id);

  let bookFile = null;
  let error = null;

  const template = _getTemplate(invoice);

  carbone.render(template, invoice, {
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
    }, 100);
  });
};

module.exports = exportOds;
