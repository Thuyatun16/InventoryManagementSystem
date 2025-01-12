const path = require('path');

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: [
      // Exclude problematic packages
      path.resolve(__dirname, 'node_modules/html5-qrcode')
    ]
  });
  return config;
};
