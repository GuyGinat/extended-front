module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  "parser": "babel-eslint",
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
