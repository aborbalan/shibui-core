module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: ["./tsconfig.json", "./.config/tsconfig.json"],
    tsconfigRootDir: process.cwd(),
  },
  plugins: [
    "@typescript-eslint"
  ],
  overrides: [
    {
      files: ["**/*.html.ts"],
      parserOptions: {
        project: ["./tsconfig.json"],
        extraFileExtensions: [".html.ts"]
      }
    }
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:storybook/recommended"
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "error"
  },
  ignorePatterns: [
    "dist",
    "node_modules",
    "*.d.ts",
    "!src/**/*"
  ]
};
