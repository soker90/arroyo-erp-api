const _mapPrice = ({ price, cost, sale }) => ({
  price,
  cost,
  sale,
});

/**
 * Create JSON response with products and last price
 * @return {[Object]}
 */
const productsResponse = products => (
  products.map(({
    _id, name, price, code,
  }) => ({
    _id,
    name,
    code,
    ...(price && _mapPrice(price)),
  }))
);

module.exports = {
  productsResponse,
};
