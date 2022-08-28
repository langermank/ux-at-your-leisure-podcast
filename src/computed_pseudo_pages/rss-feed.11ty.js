// With thanks to https://github.com/miller-productions/gatsby-plugin-podcast-feed-mdx/blob/master/src/gatsby-node.js

const RSS = require("rss");
const site = require("../_data/metadata");

const feedOptions = {
  author: site.author,
  title: site.title,
  description: site.description,
  generator: null,
  site_url: `${site.url}/`,
  feed_url: `${site.url}/feed.xml`,
  image_url: site.url + site.square_cover_image_relative_url,
  categories: site.podcast_categories,
  custom_namespaces: {
    itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    googleplay: "http://www.google.com/schemas/play-podcasts/1.0",
  },
  custom_elements: [
    { "itunes:author": site.author },
    { "itunes:title": site.title },
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
    {
        "itunes:owner": [{ "itunes:email": site.email }]
    },
    { "language": site.lang },
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
      subtitle,
      pubDate,
      summary,
      description,
      explicit,
      audio_filesize,
      duration,
        page,
        episode_number,
      season
    } = episode;

    // add an episode item to the feed using the options
    feed.item({
      title: title,
      author: site.author,
      description: description,
      url: site.url + page.url,
        custom_elements: [
            { "itunes:author": site.author },
            { "itunes:title": title },
            { "itunes:subtitle": subtitle },
            { "itunes:summary": description },
            { "itunes:duration": duration },
            { "itunes:explicit": explicit },
            { "itunes:season": season },
            { "itunes:episode": episode_number },
            { "pubDate": pubDate },
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
    //   eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    //let episodes = [{ title: "epo1x" }];
    let posts = data.collections.posts.map((post) => {
      return post.data;
    });
    addEpisodes(posts);
    return feed.xml({ indent: true });
      console.log(data.collections.posts)
  }
}

module.exports = TheClass;
// console.log(TheClass)
