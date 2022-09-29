const carbone = require('carbone');
const {
  ProductModel,
  ProviderModel,
} = require('arroyo-erp-models');
const { roundNumber } = require('../../../../utils');

const _productsAdapter = products => products.map(product => ({
  nombre: product.name,
  precio: product.price,
  coste: product.cost,
  pvp: product.sale,
  beneficio: roundNumber(product.sale - product.cost),
  beneficioPor: ((product.sale - product.cost) / product.sale),
}));

const _getProviderProducts = async provider => {
  const products = await ProductModel.find({
    provider,
  }, 'name price cost sale')
    .collation({ locale: 'es' })
    .sort({
      name: 1,
    });

  const providerData = await ProviderModel.findOne({ _id: provider }, 'name');

  return {
    nombre: providerData.name,
    fecha: new Date().toLocaleString('es-ES', { dateStyle: 'short' }),
    products: _productsAdapter(products),

  };
};

const exportOds = async ({
  id,
}) => {
  const data = await _getProviderProducts(id);

  let productsFile = null;
  let error = null;

  carbone.render('./templates/productos.ods', data, {
    lang: 'es-es',
  }, (err, result) => {
    /* istanbul ignore next */
    if (err) {
      error = err;
      return;
    }
    productsFile = result;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      /* istanbul ignore next */
      if (error) reject(error);
      /* istanbul ignore next */
      if (productsFile) resolve(productsFile);
    }, 1000);
  });
};

module.exports = exportOds;
