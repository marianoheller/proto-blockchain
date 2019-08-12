const axios = require("axios");
const chalk = require("chalk");
const R = require("ramda");

const URL = "http://localhost";

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
  GET_KEY: 0,
  SEND_MONEY: 1,
  GOSSIP: 2
};

const gossip = ({ port, peers, blockchain }) =>
  axios
    .post(`${URL}:${port}/gossip`, {
      peers,
      blockchain
    })
    .catch(showError);

const getKey = ({ port }) =>
  axios.get(`${URL}:${port}/pubKey`).catch(showError);

const sendMoney = ({ port, to, amount }) =>
  axios
    .post(`${URL}:${port}/sendMoney`, { from, to, amount })
    .then(showSuccess)
    .catch(showError);

module.exports = {
  types: ACTIONS,
  actions: {
    [ACTIONS.GET_KEY]: getKey,
    [ACTIONS.SEND_MONEY]: sendMoney,
    [GOSSIP.SEND_MONEY]: gossip
  }
};
