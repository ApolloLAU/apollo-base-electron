module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'off',
    'promise/always-return': 'off',
    'promise/catch-or-return': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'max-classes-per-file': 'off',
    'no-plusplus': 'off',
    'react/no-array-index-key': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
