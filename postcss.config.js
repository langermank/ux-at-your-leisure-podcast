const postcssJitProps = require('postcss-jit-props')
const OpenProps = require('open-props')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const postcssLogical = require('postcss-logical')
const postcssPresetEnv = require('postcss-preset-env')
const postcssNested = require('postcss-nested')
// const postcssCustomMedia = require('postcss-custom-media');
const atImport = require('postcss-import')
const postcssMixins = require('postcss-mixins')

module.exports = {
  plugins: [
    postcssJitProps(OpenProps),
    postcssLogical,
    postcssMixins,
    cssnano,
    autoprefixer,
    postcssPresetEnv({
      // debug: true,
      stage: 0,
      browsers: 'last 2 versions',
      //   importFrom: ['./dist/static/css/open-props/media-node.css'],
      // insertAfter: {
      //     'nesting-rules': cssnano
      // }
    }),
    postcssNested,
    atImport(),
  ],
}
