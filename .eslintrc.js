module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
  },
  overrides: [
    {
      files: ['**/*.{spec,test}.*'],
      plugins: ['jest', 'testing-library'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest-dom/recommended',
        'plugin:testing-library/react',
      ],
      rules: {
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/no-render-in-setup': 'off',
        'testing-library/no-unnecessary-act': 'off',
        'testing-library/no-node-access': 'off',
        'testing-library/no-container': 'off',
        'testing-library/await-async-utils': 'off',
        'testing-library/no-wait-for-side-effects': 'off',
        'jest/no-alias-methods': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
  ],
};
