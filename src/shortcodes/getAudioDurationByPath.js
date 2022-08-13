const mm = require("music-metadata");

const doTheWork = function (filePath) {
  return mm
    .parseFile(filePath)
    .then((metadata) => {
      let date = new Date(null);
      date.setSeconds(metadata.format.duration);
      var MHSTime = date.toISOString().substr(11, 8);

      return MHSTime;
    })
    .catch((err) => {
      console.log(err);
    });
};

const blankFunction = () => {};

const doMusicDuration = async function(filePath) {
  let durat = await doTheWork(filePath);
  blankFunction(null, durat);
};

module.exports = doTheWork;