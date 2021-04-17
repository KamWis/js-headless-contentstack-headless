module.exports = {
  env: {
    node: true,
    amd: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:css-modules/recommended'
  ],
  plugins: ['@typescript-eslint', 'react', 'prettier', 'css-modules'],
  rules: {
    'react/prop-types': 'off',
    'no-console': 'off',
    'no-var': 'error'
  },
  globals: {
    React: 'writable'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
