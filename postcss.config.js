module.exports = ({ file, options, env }) => ({
  // parser: file.extname === '.sss' ? 'sugarss' : false,
  // plugins: {
  //   'postcss-import': { root: file.dirname },
  //   'postcss-cssnext': options.cssnext ? options.cssnext : false,
  //   'autoprefixer': env == 'production' ? options.autoprefixer : false,
  //   'cssnano': env === 'production' ? options.cssnano : false
  // }
  plugins: [ require('autoprefixer')({ browsers: ["Android >= 4", "iOS >= 7"]}) ]
})