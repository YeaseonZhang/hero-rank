module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  printWidth: 80,
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      options: {
        parser: 'babel-flow',
      },
    },
  ],
};
