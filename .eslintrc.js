// module.exports = {
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     project: './tsconfig.json',
//     tsconfigRootDir: __dirname,
//     sourceType: 'module',
//   },
//   plugins: ['@typescript-eslint/eslint-plugin'],
//   extends: [
//     'plugin:@typescript-eslint/recommended',
//     'plugin:@typescript-eslint/recommended-requiring-type-checking',
//     'plugin:prettier/recommended',
//   ],
//   root: true,
//   env: {
//     node: true,
//     jest: true,
//   },
//   rules: {
//     '@typescript-eslint/explicit-function-return-type': 'off',
//     '@typescript-eslint/explicit-module-boundary-types': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     '@typescript-eslint/restrict-plus-operands': 'off',
//     '@typescript-eslint/no-floating-promises': 'off',
//   },
//   overrides: [
//     {
//       files: ['**/*.{spec,test}.*'],
//       plugins: ['jest', 'testing-library'],
//       extends: [
//         'plugin:jest/recommended',
//         'plugin:jest-dom/recommended',
//         'plugin:testing-library/react',
//       ],
//     },
//   ],
// };
