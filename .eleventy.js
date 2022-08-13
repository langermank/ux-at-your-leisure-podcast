const yaml = require("js-yaml");
const xmlFiltersPlugin = require("eleventy-xml-plugin");

const { DateTime } = require("luxon");

// Per 11ty from scratch, we have to have a module.exports definition
module.exports = (eleventyConfig) => {
  // See if this helps with things that do not refresh
//   module.exports = function (eleventyConfig) {
//     eleventyConfig.setUseGitIgnore(false);
//   };

    eleventyConfig.addFilter("postDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    });

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Make Liquid capable of rendering "partials"
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strict_filters: true,
  });

  // Add pass-thru file copy
  eleventyConfig.addPassthroughCopy("./src/static");

  // Add a "get file size" function to template languages
  eleventyConfig.addFilter(
    "getFileSizeByPath",
    require("./src/filters/getFileSizeByPath.js")
  );

  // Add a "get audio duration" function to template languages
//   eleventyConfig.addShortcode(
//     "getAudioDurationByPath",
//     require("./src/shortcodes/getAudioDurationByPath.js")
//   );

  // Make "_data" capable of reading .yaml files
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Add Jekyll-like XML tools
  eleventyConfig.addPlugin(xmlFiltersPlugin);

  // Add Jekyll-like Markdownify
  let md_options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  let md = require("markdown-it");
  let markdownLib = md(md_options);
  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return markdownLib.render(content);
  });

  // Clarify which folder is for input and which folder is for output
  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
