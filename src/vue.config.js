
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/fc-product-configurator/'
    : '/',
  outputDir: 'dist'
}
