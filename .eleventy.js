const fs = require("fs");
const yaml = require("js-yaml");
const xmlFiltersPlugin = require("eleventy-xml-plugin");
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");

const CleanCSS = require("clean-css");

module.exports = (eleventyConfig) => {

    eleventyConfig.addFilter("cssmin", function(code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.addFilter('values', Object.values);

    // copy static files to dist
    eleventyConfig.addPassthroughCopy("src/static");

    eleventyConfig.addWatchTarget("./src/static/css");

    eleventyConfig.addPassthroughCopy({
        "node_modules/open-props/normalize.min.css": "static/css/open-props/normalize.css"
    });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/animations.min.css": "static/css/open-props/animations.css"
    // });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/borders.min.css": "static/css/open-props/borders.css"
    // });

    eleventyConfig.addPassthroughCopy({
        "node_modules/open-props/buttons.min.css": "static/css/open-props/buttons.css"
    });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/colors-hsl.min.css": "static/css/open-props/colors-hsl.css"
    // });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/easings.min.css": "static/css/open-props/easings.css"
    // });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/fonts.min.css": "static/css/open-props/fonts.css"
    // });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/gradients.min.css": "static/css/open-props/gradients.css"
    // });

    eleventyConfig.addPassthroughCopy({
        "node_modules/open-props/media.min.css": "static/css/open-props/media-node.css"
    });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/shadows.min.css": "static/css/open-props/shadows.css"
    // });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/sizes.min.css": "static/css/open-props/sizes.css"
    // });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/borders.min.css": "static/css/open-props/borders.css"
    // });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/zindex.min.css": "static/css/open-props/zindex.css"
    // });

    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/open-props/src/extra/**/*.css": "static/css/open-props/"
    // });

    eleventyConfig.addPlugin(pluginNavigation);

    // Make "_data" capable of reading .yaml files
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

    // filters
    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    });

    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
    });

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
    });


    // Add a "get audio duration" function to template languages (broken)
    //   eleventyConfig.addShortcode(
    //     "getAudioDurationByPath",
    //     require("./src/shortcodes/getAudioDurationByPath.js")
    //   );

    // Add a "get file size" function to template languages
    eleventyConfig.addFilter(
        "getFileSizeByPath", require("./src/filters/getFileSizeByPath.js")
    );

    // Get the first `n` elements of a collection.
    eleventyConfig.addFilter("head", (array, n) => {
        if(!Array.isArray(array) || array.length === 0) {
            return [];
        }
        if( n < 0 ) {
            return array.slice(n);
        }

        return array.slice(0, n);
    });

    // Return the smallest number argument
    eleventyConfig.addFilter("min", (...numbers) => {
        return Math.min.apply(null, numbers);
    });

    function filterTagList(tags) {
        return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
    }

    eleventyConfig.addFilter("filterTagList", filterTagList)

    // Create an array of all tags
    eleventyConfig.addCollection("tagList", function(collection) {
        let tagSet = new Set();
        collection.getAll().forEach(item => {
        (item.data.tags || []).forEach(tag => tagSet.add(tag));
        });

        return filterTagList([...tagSet]);
    });

    // eleventyConfig.addCollection('episodes', curry(addFilteredCollection)(['episodes/*.md'], compareDatesDesc));


    // shortcodes
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link",
      symbol: "#"
    }),
    level: [1,2,3,4],
    slugify: eleventyConfig.getFilter("slugify")
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
          "liquid",
      "js"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    }
  };


//   // Make Liquid capable of rendering "partials"
//   eleventyConfig.setLiquidOptions({
//     dynamicPartials: true,
//     strict_filters: true,
//   });

//   // Add Jekyll-like XML tools
//   eleventyConfig.addPlugin(xmlFiltersPlugin);

//   // Add Jekyll-like Markdownify
//   let md_options = {
//     html: true,
//     breaks: true,
//     linkify: true,
//   };
//   let md = require("markdown-it");
//   let markdownLib = md(md_options);
//   eleventyConfig.addPairedShortcode("markdown", (content) => {
//     return markdownLib.render(content);
//   });

//   // Clarify which folder is for input and which folder is for output
//   return {
//     dir: {
//       input: "src",
//       output: "dist",
//     },
//   };

};
