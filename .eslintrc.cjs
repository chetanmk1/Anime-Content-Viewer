module.exports = {
  root: true,
  env: {
    browser: true,
    node: true, // <-- allows process, __dirname, etc.
    es2021: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "espree",
    ecmaVersion: 2021,
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  ignorePatterns: [
    ".quasar/",
    "dist/",
    "node_modules/"
  ]
};
