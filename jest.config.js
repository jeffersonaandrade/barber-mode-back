module.exports = {
  testMatch: ['**/tests/**/*.test.js'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/**',
    '!src/plugins/**'
  ],
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  verbose: true
}; 