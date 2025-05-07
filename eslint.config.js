import antfu from '@antfu/eslint-config'

export default antfu({
  stylistics: {
    indent: 2,
    semi: true,
    quotes: 'double',
  },
  rules: {
    'no-console': ['warn'],
    'perfectionist/sort-imports': ['error', {
      type: 'line-length',
      internalPattern: ['^@/.+'],
    }],
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
        ignore: ['README.md'],
      },
    ],
    'symbol-description': ['off'],
  },
})
