const path = require('path');

/** Helper to auto-prefix a font src url with the path to local fonts. */
const getFontUrl = (src) => path.join('dist/static/fonts', src);


const FontStyle = {
  NORMAL: 'normal',
  ITALIC: 'italic',
};

const FontDisplay = {
  SWAP: 'swap',
};

const FontVariant = {
	Regular: 'Regular',
	Italic: 'Italic',
};

const fonts = {
  body: {
    family: 'Mezzotint',
    fallbacks: [
      `-apple-system`,
      `BlinkMacSystemFont`,
      `Segoe UI`,
      `Roboto`,
      `Oxygen`,
      `Ubuntu`,
      `Cantarell`,
      `Open Sans`,
      `Helvetica Neue`,
      `sans-serif`,
    ],
    weights: {
      regular: {
        variant: FontVariant.Regular,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('MezzotintCF-Italic.woff2'),
        display: FontDisplay.SWAP,
      },
      regularItalic: {
        variant: FontVariant.Italic,
        weight: 400,
        style: FontStyle.ITALIC,
        url: getFontUrl('MezzotintCF-Regular.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
};

module.exports = fonts;
