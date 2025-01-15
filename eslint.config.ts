import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: ['.next', '.vercel', 'certificates', 'node_modules', 'out'],
  },
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'eslint-config-prettier',
    ],
    plugins: ['eslint-plugin-prettier', 'eslint-plugin-simple-import-sort'],
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^__', varsIgnorePattern: '^__' },
      ],
      'import/order': 'off',
      'prettier/prettier': ['error', { singleQuote: true }],
      'simple-import-sort/exports': 'error',
      'sort-imports': 'off',
    },
  }),
];

export default eslintConfig;
