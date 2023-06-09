module.exports = {
  serial: true,
  verbose: true,
  files: [
    'test/*.js',
    'test/**/*.js',
    'test/**/**/*.js',
    '!test/fixtures',
    '!test/shared'
  ]
};
