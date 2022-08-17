/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>', __dirname],

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules', __dirname],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/*(*.spec).@(t|j)s?(x)'],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/!(*.spec).@(t|j)s?(x)'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
