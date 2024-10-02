module.exports = {
  preset: '@shelf/jest-mongodb',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**',
    'test/**',
  ],
  bail: true,
  setupFilesAfterEnv: [
    '<rootDir>/test/bootstrap-jest.js',
  ],
  coverageReporters: [
    'json',
    'text-summary',
    'lcov',
    'clover',
  ],
  coveragePathIgnorePatterns: [],
};
