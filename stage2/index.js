const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const readline = require("readline");
const chalk = require("chalk");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const client = require("./client");
const helpers = require("./helpers");

const PORT = argv["p"];
const PEERPORT = argv["pp"];

if (!PORT || !PEERPORT)
  throw new Error(`Invalid params. Got p: ${PORT}, pp: ${PEERPORT}`);

const FILE_PATH = "./movies";
const MOVIES = [];
let state = helpers.updateState({}, [
  {
    [PORT]: { [helpers.FAVORITE_MOVIE]: null, [helpers.VERSION_NUMBER]: 0 }
  },
  {
    [PEERPORT]: {
      [helpers.FAVORITE_MOVIE]: null,
      [helpers.VERSION_NUMBER]: 0
    }
  }
]);

const readInterface = readline.createInterface({
  input: fs.createReadStream(FILE_PATH),
  console: false
});

readInterface.on("line", line => MOVIES.push(line));

const getRandom = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

const getGossips = async () => {
  const ports = Object.keys(state).filter(p => p != PORT);
  ports.forEach(async p => {
    console.log(chalk.green(`Fetching update from ${p}`));
    try {
      const gossip = await client.gossip(p, state);
      state = updateState(state, [gossip]);
    } catch (err) {
      // TODO: delete old PORT
      console.log(chalk.red(err));
    }
  });
  helpers.renderState(state);
};

const changeMovie = () => {
  const favoriteMovie = helpers.getFavoriteMovie(state, PORT);
  const versionNumber = helpers.getVersionNumber(state, PORT);
  const newFavoriteMovie = getRandom(MOVIES);
  console.log(chalk.red(`Screw ${favoriteMovie}`));
  state = helpers.updateState(state, [
    {
      [PORT]: {
        [helpers.FAVORITE_MOVIE]: newFavoriteMovie,
        [helpers.VERSION_NUMBER]: versionNumber + 1
      }
    }
  ]);
  console.log(chalk.green(`My new favorite movie is ${newFavoriteMovie}`));
};

readInterface.on("close", () => {
  console.log(chalk.green(`Loaded ${MOVIES.length} movies`));
  const favoriteMovie = getRandom(MOVIES);
  state = helpers.updateState(state, [
    {
      [PORT]: {
        [helpers.FAVORITE_MOVIE]: favoriteMovie,
        [helpers.VERSION_NUMBER]: 1
      }
    }
  ]);
  console.log(
    chalk.green(`My favorite movie, now and forever, is ${favoriteMovie}`)
  );

  setInterval(() => getGossips(), 3000);
  setInterval(() => changeMovie(), 8000);
});

/**
 * EXPRESS SERVER
 */
const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

app.post("/gossip", (req, res) => {
  const theirState = req.body;
  state = helpers.updateState(state, [theirState]);
  return state;
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
