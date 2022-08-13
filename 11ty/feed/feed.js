// With thanks to https://github.com/miller-productions/gatsby-plugin-podcast-feed-mdx/blob/master/src/gatsby-node.js

const RSS = require("rss");
const site = require("../_data/site");

const feedOptions = {
  author: site.author,
  title: site.title,
  description: site.description,
  generator: null,
  site_url: `${site.url}/`,
  feed_url: `${site.url}/feed.xml`,
  image_url: site.url + site.square_cover_image_relative_url,
  categories: site.podcast_categories,
  pubDate: site.jekyll_site_time,
  custom_namespaces: {
    itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    googleplay: "http://www.google.com/schemas/play-podcasts/1.0",
  },
  custom_elements: [
    { "itunes:author": site.author },
    { "itunes:title": site.title },
    { "itunes:subtitle": "Shorter stuff" },
    { "itunes:summary": site.description.substring(0, 3999) },
    {
      "itunes:image": {
        _attr: {
          href: site.url + site.square_cover_image_relative_url,
        },
      },
    },
    ...(site.podcast_categories.map((cat) => {
      return { "itunes:category": [{ _attr: { text: cat } }] };
    })),
    { "googleplay:author": site.author },
    { "googleplay:description": site.description.substring(0, 3999) },
    { "googleplay:explicit": false },
  ],
};

const feed = new RSS(feedOptions);

const addEpisodes = (episodes) => {
  // for each episode
  episodes.forEach((episode) => {
    const {
      audio_file_path,
      audio_file_relative_url,
      title,
      date,
      summary,
      description,
      explicit,
      audio_filesize,
      audio_duration,
      page,
    } = episode;

    // add an episode item to the feed using the options
    feed.item({
      title: title,
      author: site.author,
      description: "hi there",
      url: site.url + page.url,
      custom_elements: [
        { "itunes:author": site.author },
        { "itunes:title": title },
        { "itunes:subtitle": "hi there itunes" },
        { "itunes:summary": description },
        { "itunes:duration": audio_duration },
        { "itunes:explicit": explicit },
      ],
      enclosure: {
        url: site.url + audio_file_relative_url,
        size: audio_filesize,
        type: "audio/mpeg",
      },
    });
  });
};

class TheClass {
  data() {
    return {
      permalink: (data) => {
        return `/feed.xml`;
      },
      layout: null,
      //eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    //let episodes = [{ title: "epo1x" }];
    let episodes = data.collections.episodes.map((episode) => {
      return episode.data;
    });
    addEpisodes(episodes);
    return feed.xml({ indent: true });
  }
}

module.exports = TheClass;
