import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  // Flat config has no implicit ignores beyond node_modules/.git - without
  // this, `eslint .` (the actual npm run lint command, now that --ext is
  // gone - see package.json) walked into dist/ and linted built, minified
  // JS bundles as if they were source, producing 800+ fake "console is not
  // defined" style errors that had nothing to do with real code.
  {
    ignores: [
      "dist/",
      "storybook-static/",
      "coverage/",
      "playwright-report/",
      "test-results/",
      "jest.setup.js",
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // =========================
  // Browser / Frontend files
  // =========================
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Allow intentionally unused vars like `_`, `_req`, `_err`
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // React Fast Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // =========================
  // Test files (Jest globals)
  // =========================
  {
    files: ["src/**/*.test.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // =========================
  // Playwright responsive e2e suite (see e2e/, playwright.config.ts)
  // =========================
  {
    files: ["e2e/**/*.ts", "playwright.config.ts"],
    languageOptions: {
      parser: tsParser,
      // Both: the test files themselves run under Node (process.env, etc.),
      // but page.evaluate() callbacks execute inside the real browser and
      // reference DOM globals like `document` - ESLint can't tell the two
      // scopes apart from the outside.
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  // =========================
  // Node / Backend files
  // =========================
  {
    files: ["src/api/**/*.ts", "scripts/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
