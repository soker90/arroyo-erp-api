const carbone = require('carbone');
const { ClientInvoiceModel, ClientModel } = require('arroyo-erp-models');
const { formatDate } = require('../../../../utils');

const _productAdapter = product => ({
  descripcion: product.name,
  peso: `${product.weight} ${product.unit}`,
  precio: product.price,
  importe: product.total,
});

const _doAdapter = deliveryOrder => {
  let rows = [];
  if (deliveryOrder.date) rows.push({ descripcion: formatDate(deliveryOrder.date) });

  rows = [
    ...rows,
    ...deliveryOrder.products.map(_productAdapter),
  ];

  return rows;
};

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

const _getInvoice = async id => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id }).populate('client', null, ClientModel);

  return _invoicesAdapter(invoice);
};

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
    }, 1000);
  });
};

module.exports = exportOds;
