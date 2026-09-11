/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // e2e/ holds the Playwright responsive suite (run via `npm run
  // test:responsive`, not Jest) - its *.spec.ts files match Jest's default
  // testMatch, and requiring @playwright/test's `test`/`expect` outside
  // Playwright's own runner throws deep inside playwright-core.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // src/config/env.ts reads import.meta.env, which Jest's transform can't
    // parse at all (Jest doesn't actually run as native ESM here despite
    // useESM below) - swap in the literal-only test substitute instead of
    // ever asking Jest to parse the real file. Matches any relative import
    // ending in config/env, regardless of the importing file's own depth.
    '(?:^|/)config/env$': '<rootDir>/src/config/env.jest.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.jest.json',
    }],
  },
  //no need for this globals if you're already using the modern transform API with inline ts-jest config:
  // globals: {
  //   'ts-jest': {
  //     tsconfig: '<rootDir>/tsconfig.jest.json',
  //     useESM: true
  //   }
  // },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/config/env.ts', // never actually executed under Jest - see moduleNameMapper
    '!src/config/env.jest.ts', // test-only substitute, not app code
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
