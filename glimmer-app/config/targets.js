let browsers = [
  'last 1 Chrome versions',
];

if (process.env.EMBER_ENV === 'test') {
  browsers = [
    'last 1 Chrome versions',
  ];
}

module.exports = { browsers };
