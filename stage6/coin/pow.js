const forge = require("node-forge");
const chalk = require("chalk");
const succ = require("./succ");

const NUM_ZEROES = 4;
const INIT_NONCE = "AASDASDAS, NONCE FACTORY!!!";

const hash = msg => {
  const md = forge.md.sha256.create();
  md.update(msg);
  return md.digest().toHex();
};

const findNonce = (msg, nonce = INIT_NONCE) => {
  let count = 0;
  let isValid = isValidNonce(nonce, msg);
  while (!isValid) {
    nonce = succ(nonce);
    count++;
    isValid = isValidNonce(nonce, msg);
  }
  return nonce;
};

const isValidNonce = (nonce, msg) => {
  return hash(msg + nonce).startsWith(
    Array(NUM_ZEROES)
      .fill(0)
      .join("")
  );
};

module.exports = {
  isValidNonce,
  findNonce,
  hash
};
