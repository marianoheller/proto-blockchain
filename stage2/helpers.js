const R = require("ramda");
const chalk = require("chalk");

const FAVORITE_MOVIE = "FAVORITE_MOVIE";
const VERSION_NUMBER = "VERSION_NUMBER";

const updateState = (state = {}, gossips = []) => {
  let _state = { ...state };
  gossips.forEach(gossip => {
    _state = R.merge(state, gossip);
  });
  return _state;
};

const getFavoriteMovie = (state = {}, port) => {
  if (!port) throw new Error("Invalid port", port);
  return state[port][FAVORITE_MOVIE];
};

const getVersionNumber = (state = {}, port) => {
  if (!port) throw new Error("Invalid port", port);
  return state[port][VERSION_NUMBER];
};

const prettyPrint = (v, p) => {
  console.log(
    `${chalk.blue(p)} currently likes ${chalk.yellow(
      R.prop(FAVORITE_MOVIE, v)
    )}`
  );
};
const renderState = state => {
  console.log(chalk.green("Current state:"));
  R.forEachObjIndexed(prettyPrint, state);
};

module.exports = {
  updateState,
  getFavoriteMovie,
  getVersionNumber,
  renderState,
  FAVORITE_MOVIE,
  VERSION_NUMBER
};
