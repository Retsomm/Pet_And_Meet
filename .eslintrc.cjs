/**
 * ESLint configuration tuned for this TypeScript + React project.
 *
 * Goals:
 * - Enable TypeScript-aware linting via @typescript-eslint
 * - Enable React + React Hooks rules
 * - Surface potential React Compiler-friendly diagnostics (where available)
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',

    // React rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // Encourage hooks best practices
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Project-specific stylistic choices
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // allow TS to handle explicit any decisions in certain files
      }
    }
  ]
};
