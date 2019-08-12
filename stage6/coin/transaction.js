const R = require("ramda");
const pki = require("./pki");

function Transaction(from, to, amount, privateKey) {
  const payload = [from, to, amount].join("");
  const signature = pki.sign(payload, privateKey);
  const isGenesis = R.isNil(from);
  return {
    from,
    to,
    amount,
    signature,
    isValidSignature() {
      if (!isGenesis) return true;
      pki.validSignature(payload, "", signature); // <-- TODO:
    },
    render() {
      return `${from} -> ${to} | ${amount}`;
    }
  };
}

const hasValidKeys = R.compose(
  R.equals(0),
  R.length,
  R.difference
);

const isTransaction = t => {
  const { privateKey } = pki.generateKeyPair();
  const targetKeys = Object.keys(t);
  const validKeys = Object.keys(Transaction("", "", 99, privateKey));
  return hasValidKeys(targetKeys, validKeys);
};

module.exports = {
  Transaction,
  isTransaction
};
