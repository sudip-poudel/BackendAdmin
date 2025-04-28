// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    // Default ignores (except the ones we want to lint)
    ignores: ["**/node_modules/", "**/dist/", "**/build/", "**/coverage/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: true, // Enable TypeScript project mode
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Base ESLint rules
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      //quotes: ["error", "single"],
      semi: ["error", "always"],
      "no-unused-vars": "off",

      // TypeScript-specific rules
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
