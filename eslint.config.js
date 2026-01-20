import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

const overrides = {
  "prefer-template": "error",
  "react/no-unescaped-entities": "off",
  "react/prop-types": "off",
  "react/react-in-jsx-scope": "off",
  "unicorn/filename-case": "off",
  "unicorn/no-array-reverse": "off",
  "unicorn/no-array-sort": "off",
  "unicorn/no-null": "off",
  "unicorn/prefer-optional-catch-binding": "off",
  "unicorn/prevent-abbreviations": "off",
  "unicorn/text-encoding-identifier-case": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      caughtErrorsIgnorePattern: "^_",
      ignoreRestSiblings: false,
      vars: "all",
      varsIgnorePattern: "^_",
    },
  ],
};

export default defineConfig(
  { ignores: ["dist", "postcss.config.cjs"] },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } },
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactHooks.configs.flat["recommended-latest"],
  eslintPluginUnicorn.configs.recommended,
  prettierConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    rules: overrides,
  },
);
