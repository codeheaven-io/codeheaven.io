const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const withSass = require('@zeit/next-sass')

module.exports = withSass({
  exportPathMap: async function() {
    const paths = {
      '/': { page: '/' },
      // TODO
      // '/about': { page: '/about' }
    };

    fs.readdirSync(path.resolve(__dirname, 'src', 'posts')).forEach(filename => {
      if (!filename.endsWith('.md')) {
        return
      }
      const slug = slugify(filename).slice(0, -3)
      paths[`/${slug}`] = { page: '/[slug]', query: { slug } };
    });

    return paths;
  },
  webpack: function(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
})
