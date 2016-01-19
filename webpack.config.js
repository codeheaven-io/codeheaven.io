module.exports = {
    entry: {
      'd3-github': './assets/scripts/posts/d3-github.js'
    },
    output: {
      path: './_site/assets/scripts/posts/',
      filename: '[name].bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['react', 'es2015', 'stage-0']
          }
        }
      ]
    }
};
