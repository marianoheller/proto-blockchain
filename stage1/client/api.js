const axios = require("axios");
const chalk = require("chalk");
const R = require("ramda");

const URL = "http://localhost";
const PORT = 3000;

const showError = R.compose(
  console.error,
  chalk.red
);
const showSuccess = R.compose(
  console.log,
  chalk.green,
  R.prop("data")
);

const ACTIONS = {
  GET_BALANCE: 0,
  CREATE_USER: 1,
  TRANSFER: 2
};

const getBalance = ({ user }) =>
  axios
    .get(`${URL}:${PORT}/balance/${user}`)
    .then(showSuccess)
    .catch(showError);

const createUser = ({ user }) =>
  axios
    .post(`${URL}:${PORT}/users/${user}`)
    .then(showSuccess)
    .catch(showError);

const transfer = ({ from, to, amount }) =>
  axios
    .post(`${URL}:${PORT}/transfers`, { from, to, amount })
    .then(showSuccess)
    .catch(showError);

module.exports = {
  types: ACTIONS,
  actions: {
    [ACTIONS.GET_BALANCE]: getBalance,
    [ACTIONS.CREATE_USER]: createUser,
    [ACTIONS.TRANSFER]: transfer
  }
};
