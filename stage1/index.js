const R = require("ramda");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(morgan("combined"));

const BALANCES = {
  mariano: 999
};

const parseUser = R.compose(R.toLower);

const parseAmount = R.compose(
  R.max(0),
  Number
);

app.get("/balance/:user", (req, res) => {
  const { user: _user } = req.params;
  const user = parseUser(_user);
  res.send(`${user} has ${BALANCES[user]}`);
});

app.post("/users/:user", (req, res) => {
  const { user: _user } = req.params;
  const user = parseUser(_user);
  if (!BALANCES[user]) BALANCES[user] = 0;
  res.send("OK");
});

app.post("/transfers", (req, res) => {
  const { from: _from, to: _to, amount: _amount } = req.body;
  const from = parseUser(_from);
  const to = parseUser(_to);
  const amount = parseAmount(_amount);
  if (BALANCES[from] < amount) throw new Error("Insufficient funds");
  BALANCES[to] += amount;
  BALANCES[from] -= amount;
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
