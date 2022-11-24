module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    camelcase: 0,
    "object-curly-spacing": 0,
    quotes: 0,
    "array-bracket-spacing": 0,
    "no-var": 0,
    "object-shorthand": 0,
    "arrow-parens": 0,
    "no-unused-vars": ["error", { args: "none" }],
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
  },
  overrides: [
    {
      files: [
        "jest.config.js",
        "babel.config.js",
        "rollup.config.js",
        "rollup.test.config.js",
      ],
      env: {
        browser: false,
        node: true,
      },
    },
  ],
  settings: {
    "import/resolver": {
      alias: [
        ["@lib", "./lib"],
        ["miragejs", "./index"],
      ],
      node: {
        extensions: ["js", "ts"],
      },
    },
  },
};
