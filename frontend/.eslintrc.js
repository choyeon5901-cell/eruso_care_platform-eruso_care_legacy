module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true   // 👈 여기로 합쳐야 함
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "error",

    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
};