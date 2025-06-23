export default {
  clearMocks: true,
  transform: {},
  testEnvironment: "jsdom",
  coverageProvider: "v8",
  setupFiles: [
    "<rootDir>/.vercel/output/functions/api.func/core-app/tests/setup.jest.js",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.vercel/output/functions/api.func/core-app/tests/e2e/",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.vercel/output/functions/api.func/core-app/tests/e2e/",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.vercel/output/functions/api.func/core-app/tests/E2E/",
  ],
};
