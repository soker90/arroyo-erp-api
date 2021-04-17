/**
 * Return adapted object with clients
 * @param {Array} clients
 * @param {Array} invoices
 * @returns {[{_id: string, name: string, invoices: number}]}
 */
const clientsResponse = ({
  clients,
  invoices,
}) => clients.map(({
  name,
  _id,
}) => ({
  _id,
  name,
  invoices: invoices.find(client => client?._id === _id.toString())?.invoices || 0,
}));

module.exports = {
  clientsResponse,
};
