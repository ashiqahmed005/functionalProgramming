import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType:  'module',
      globals: {
        window:    'readonly',
        document:  'readonly',
        console:   'readonly',
        setTimeout:'readonly',
        clearTimeout: 'readonly',
        parseInt:  'readonly',
        parseFloat:'readonly',
        JSON:      'readonly',
        Map:       'readonly',
        Set:       'readonly',
        Math:      'readonly',
        Date:      'readonly',
        Promise:   'readonly',
        URL:       'readonly',
        fetch:     'readonly',
        eval:      'readonly',
      },
    },
    rules: {
      // Errors
      'no-unused-vars':          ['error', { argsIgnorePattern: '^_' }],
      'no-undef':                'error',
      'no-duplicate-imports':    'error',

      // Warnings — fixable style issues
      'prefer-const':            'warn',
      'no-var':                  'warn',
      'object-shorthand':        'warn',
      'arrow-body-style':        ['warn', 'as-needed'],
      'prefer-arrow-callback':   'warn',
      'prefer-template':         'warn',
      'no-console':              ['warn', { allow: ['warn', 'error'] }],

      // Off — too noisy for a learning project
      'no-eval':                 'off',   // panels use eval for dynamic expressions
    },
  },
  {
    // Relax rules for panel files:
    // - eval is used intentionally for dynamic expressions
    // - no-useless-escape: regex patterns inside html() template strings
    //   (used for source code display) trigger false positives
    files: ['src/visualizer/panels/*.js'],
    rules: {
      'no-unused-vars':    'warn',
      'prefer-const':      'warn',
      'no-useless-escape': 'off',
    },
  },
  {
    // Ignore built output and exercises
    ignores: ['dist/**', 'node_modules/**', 'exercises/**', 'index.js'],
  },
];
