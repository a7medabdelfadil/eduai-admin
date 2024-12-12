/** @type {import("eslint").Linter.BaseConfig} */

const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
      project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  root: true,
  env: {
      browser: true, // تأكد من أن بيئة المتصفح مفعلة
      node: true,    // لتشغيل الكود في بيئة Node.js أيضاً
  },
  rules: {
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "no-undef": "off", // تعطيل تحذيرات حول استخدام window و document
  },
};

module.exports = config;
