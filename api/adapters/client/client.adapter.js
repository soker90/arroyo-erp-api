/**
 * Return adapted object with clients
 * @param {Array} clients
 * @returns {[{_id: string, name: string, invoices: number}]}
 */
const clientsResponse = clients => clients.map(({
  _id,
  invoices,
}) => ({
  _id: _id?._id,
  name: _id?.name,
  invoices,
}));

module.exports = {
  clientsResponse,
};
