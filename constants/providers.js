const TYPE_PROVIDER = {
  GENERAL: 'General',
  EXPENSES: 'Gastos',
};

const TYPE_PROVIDER_LIST = Object.values(TYPE_PROVIDER);

const TYPES_STANDARD_PROVIDER = [
  TYPE_PROVIDER.GENERAL,
  undefined,
];

module.exports = {
  TYPE_PROVIDER,
  TYPE_PROVIDER_LIST,
  TYPES_STANDARD_PROVIDER,
};
