import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "build/**/*",
      "src/generated/**/*",
      "node_modules/**/*",
      "dist/**/*",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    languageOptions: { globals: globals.node },
  },
  ...tseslint.configs.recommended,
];
