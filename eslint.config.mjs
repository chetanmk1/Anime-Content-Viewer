import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [".quasar/**", "dist/**", "node_modules/**"]
  },
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      ecmaVersion: 2021, // allows modern JS features
      sourceType: "module", // allows 'import' and 'export'
      globals: globals.browser
    },
    plugins: {
      vue: pluginVue
    },
    extends: [
      js.configs.recommended,
      pluginVue.configs["flat/recommended"]
    ]
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"]
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"]
  }
]);
