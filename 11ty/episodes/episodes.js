// module.exports = {
//   eleventyComputed: {
//     permalink: (data) => {
//       return `/episodes/{{page.fileSlug}}/index.html`;
//     },
//     //audio_duration: `{% getAudioDurationByPath audio_file_path %}`,
//     audio_filesize: `{{ audio_file_path | getFileSizeByPath }}`,
//   },
// };

const rssPlugin = require("../")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {}
  });
};
