
// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/fc-product-configurator/'
    : '/',
  configureWebpack: {
    devtool: 'source-map'
  }
}
