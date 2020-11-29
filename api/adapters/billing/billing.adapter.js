/**
 * Return adapted object with invoice data
 * @param billings
 * @returns {[{cif: string, province: string, trimester4: number, city: string, trimester3: number,
 * trimester2: number, postalCode: string, trimester1: number, name: string, annual:  number}]}
 */
const billingsResponse = billings => billings.map(({
  provider,
  trimesters,
  annual,
}) => ({
  name: provider.businessName,
  cif: provider?.cif,
  postalCode: provider?.postalCode,
  city: provider?.city,
  province: provider?.province,
  trimester1: trimesters[0],
  trimester2: trimesters[1],
  trimester3: trimesters[2],
  trimester4: trimesters[3],
  annual,
}));

module.exports = {
  billingsResponse,
};
