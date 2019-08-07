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

module.exports = Transaction;
