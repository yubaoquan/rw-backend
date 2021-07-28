module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'import',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
        extensions: ['.tsx', '.ts'],
      },
    },
  },
  rules: {
    'no-console': 'off',
    'no-continue': 'off',
    'no-loop-func': 'off',
    'consistent-return': 'off',
    'import/extensions': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-loop-func': 'off',

    'brace-style': ['error', '1tbs'],
    '@typescript-eslint/no-extra-parens': ['error'],
    'no-param-reassign': ['error', { props: false }],

    'max-len': ['error', {
      code: 100,
      tabWidth: 2,
      ignoreComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true },
      ObjectPattern: { multiline: true },
      ImportDeclaration: { multiline: true },
      ExportDeclaration: { multiline: true },
    }],
    'max-statements-per-line': ['error', { max: 1 }],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', 'tsx'] }],
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
    '@typescript-eslint/no-use-before-define': ['error', { ignoreTypeReferences: false }],
    'react/jsx-curly-spacing': ['error', { when: 'never', attributes: true, children: true }],
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    'import/order': ['error', {
      alphabetize: { order: 'asc', caseInsensitive: false },
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
    }],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: { array: false, object: true },
        AssignmentExpression: { array: false, object: true },
      },
      { enforceForRenamedProperties: false },
    ],

    'lines-around-comment': ['error', {
      allowArrayStart: true,
      allowBlockStart: true,
      allowClassStart: true,
      allowObjectStart: true,
      beforeBlockComment: true,
      beforeLineComment: true,
    }],

    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'class', next: '*' },
      { blankLine: 'always', prev: '*', next: 'class' },
      { blankLine: 'always', prev: 'function', next: '*' },
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' },
      { blankLine: 'any', prev: 'export', next: 'export' },
    ],
    '@typescript-eslint/type-annotation-spacing': ['error',
      {
        after: true,
        before: false,
        overrides: {
          arrow: {
            after: true,
            before: true,
          },
        },
      },
    ],
  },
};
