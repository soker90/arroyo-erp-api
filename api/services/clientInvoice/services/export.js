const carbone = require('carbone');
const { ClientInvoiceModel, ClientModel } = require('arroyo-erp-models');
const { formatDate } = require('../../../../utils');

/* istanbul ignore next */
const _productAdapter = product => ({
  descripcion: product.name,
  peso: `${product.weight.toLocaleString('es-ES')} ${product.unit}`,
  precio: `${product.price.toLocaleString('es-ES')} €`,
  importe: `${product.total.toLocaleString('es-ES')} €`,
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
const _invoicesAdapter = invoice => ({
  fecha: formatDate(invoice.date),
  nFactura: invoice.nInvoice,
  empresa: invoice.client.businessName,
  direccion: invoice.client.address,
  ciudad: invoice.client.city,
  cp: invoice.client.postalCode,
  provincia: invoice.client.province,
  cif: invoice.client.cif,
  filas: invoice.deliveryOrders.map(_doAdapter).flat(),
  base: invoice.taxBase,
  iva: invoice.iva,
  total: invoice.total,
});

/* istanbul ignore next */
const _getInvoice = async id => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id }).populate('client', null, ClientModel);

  return _invoicesAdapter(invoice);
};

/* istanbul ignore next */
const exportOds = async ({ id }) => {
  const invoice = await _getInvoice(id);

  let bookFile = null;
  let error = null;

  carbone.render('./templates/invoice-client.ods', invoice, {
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
