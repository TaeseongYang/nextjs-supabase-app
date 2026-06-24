import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = tseslint.config(
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },

  {
    files: ["**/*.tsx"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "*.config.mjs",
      "*.config.ts",
      "*.config.js",
      "lib/database.types.ts",
    ],
  },

  prettierConfig,
);

export default eslintConfig;
